import {
  ADMIN_ROUTES,
  GLOBAL_COMPONENT_ROUTES,
  PRIVATE_ROUTES,
  ROUTES,
  ROUTES_WITHOUT_FOOTER,
  ROUTES_WITHOUT_HEADER,
  ROUTES_WITHOUT_SIDEBAR,
  ROUTES_WITHOUT_USER_DAY_INFO,
  UN_AUTH_ROUTES,
} from '../constants/urls.js';
import { USER_ROLES } from '../constants/user.js';
import { fetchUser } from '../middleware/user.js';
import { setAWSStore } from '../store/awsStore.js';
import { getUser, getUserRole } from '../store/userStore.js';
import {
  redirectTo,
  removeTokens,
  resetAWSConfigs,
  setInitialAWSConfigs,
} from './helpers.js';
import {
  buildBlock,
  decorateAnchors,
  decorateBlocks,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateTemplateAndTheme,
  loadBlocks,
  loadCSS,
  loadFooter,
  loadHeader,
  loadSidebar,
  loadUserDayInfo,
  sampleRUM,
  waitForLCP,
} from './lib-franklin.js';

const LCP_BLOCKS = []; // add your LCP blocks to the list

// prod
function setProductionPoolConfig() {
  window.hlx.RUM_GENERATION = 'usta-connect'; // add your RUM generation information here
  window.hlx.CLIENT_ID = '4di342va4kbl5devk1d5p4uog0'; // temporary setting clientID here
  window.hlx.USER_POOL_ID = 'us-east-1_CRUiPa1lK'; // temporary setting userPoolID here
  window.hlx.IDENTITY_POOL_ID =
    'us-east-1:c90a0d53-f82a-4907-8bf6-bfb96337ef9a'; // temporary setting userPoolID here
  window.hlx.APP_S3_BUCKETS_UPLOAD_BUCKET = 's3upload-ui-upload-prod';
  window.hlx.APP_S3_BUCKETS_DOWNLOAD_BUCKET = 's3upload-ui-download-prod';
  window.hlx.APP_S3_BUCKETS_UPLOADED_FILES_BUCKET = 's3upload-ui-scanned-prod';
  window.hlx.APP_AUTHORIZATION_API_ENDPOINT = 'https://account-ustaconnect.usta.com';
  window.hlx.APP_FILE_STATUS_API_ENDPOINT = 'https://api-ustaconnect.usta.com';
  window.hlx.APP_FILE_STATUS_API_CLIENT_ID = 'w7gnVGC0imaOL0XENYqRIZ6KMVCBGZFb';
  window.hlx.APP_FILE_STATUS_API_CLIENT_SECRET ='2eN7BpYA69zbqicg8JFtjo54XSQOm6_JcQMWxh9g2JpVs3Z1LoXXdmiorZL7CsQ-';
  window.hlx.AUDIENCE = 'https://api-ustaconnect.usta.com';
}
function setDevPoolConfig() {
  window.hlx.RUM_GENERATION = 'usta-connect'; // add your RUM generation information here
  window.hlx.CLIENT_ID = 'fcivtnqoqh25v79hcqgb3l9mp'; // temporary setting clientID here
  window.hlx.USER_POOL_ID = 'us-east-1_XcYnoGlwq'; // temporary setting userPoolID here
  window.hlx.IDENTITY_POOL_ID =
    'us-east-1:12372ea4-1035-4ca7-9428-2d1d6deb5ecf'; // temporary setting userPoolID here
  window.hlx.APP_S3_BUCKETS_UPLOAD_BUCKET = 's3upload-ui-upload';
  window.hlx.APP_S3_BUCKETS_DOWNLOAD_BUCKET = 's3upload-ui-download';
  window.hlx.APP_S3_BUCKETS_UPLOADED_FILES_BUCKET = 's3upload-ui-scanned';
  window.hlx.APP_AUTHORIZATION_API_ENDPOINT = 'https://stage-account-ustaconnect.usta.com';
  window.hlx.APP_FILE_STATUS_API_ENDPOINT = 'https://stage-api-ustaconnect.usta.com';
  window.hlx.APP_FILE_STATUS_API_CLIENT_ID = '7tpb3e2ceupf5r572oh7fpsdpe';
  window.hlx.APP_FILE_STATUS_API_CLIENT_SECRET = 'pcm2f7gi5gu0vhpqjneup3fhk35capc13n92qk5ham8onjhg3s9';
}

function setStagePoolConfig() {
  window.hlx.RUM_GENERATION = 'usta-connect'; // add your RUM generation information here
  window.hlx.CLIENT_ID = '1ia99di3pruap7emhcv9jv571j'; // temporary setting clientID here
  window.hlx.USER_POOL_ID = 'us-east-1_DKSSJUVlY'; // temporary setting userPoolID here
  window.hlx.IDENTITY_POOL_ID =
    'us-east-1:a5df722d-28a6-408b-a10c-8a391051bfb5'; // temporary setting userPoolID here
  window.hlx.APP_S3_BUCKETS_UPLOAD_BUCKET = 's3upload-ui-upload-stage';
  window.hlx.APP_S3_BUCKETS_DOWNLOAD_BUCKET = 's3upload-ui-download-stage';
  window.hlx.APP_S3_BUCKETS_UPLOADED_FILES_BUCKET = 's3upload-ui-scanned-stage';
  window.hlx.APP_AUTHORIZATION_API_ENDPOINT = 'https://stage-account-ustaconnect.usta.com';
  window.hlx.APP_FILE_STATUS_API_ENDPOINT = 'https://stage-api-ustaconnect.usta.com';
  window.hlx.APP_FILE_STATUS_API_CLIENT_ID = '7qYeHPKt6vUUHTImUWspqOMqJF4bb1VS';
  window.hlx.APP_FILE_STATUS_API_CLIENT_SECRET = 'SYvDISy2k4E_xdmQ611-86Wefxc-_vjIt2aBoLmXPZbVdWkh7F9PhklMV0tm859F';
  window.hlx.APP_SINITI_AUTHORIZATION_API_ENDPOINT = 'https://stage-account.usta.com';
  window.hlx.APP_SINITI_API_ENDPOINT = 'https://stage-services.usta.com';
  window.hlx.APP_SINITI_API_CLIENT_ID = '3sfema9t4ftf0mguomefmqr6pq';
  window.hlx.APP_SINITI_API_CLIENT_SECRET = 'ti1mscnufta4h6fh1vkshuj0so3rui213gbjft4m1c5incgnlqk';
  window.hlx.AUDIENCE = 'https://external-stage-services.usta.com';
}
const subdomain = window.location.hostname.split('.')[0];
const envUnderDomain = subdomain?.split('-')[0];

switch (envUnderDomain) {
  case 'ustaconnect':
    setProductionPoolConfig();
    break;
  case 'dev':
    setDevPoolConfig();
    break;
  case 'stage':
    setStagePoolConfig();
    break;
  case 'localhost':
    setStagePoolConfig();
    break;
  default:
    setStagePoolConfig();
}

window.hlx.GOOGLE_API_KEY = 'AIzaSyCuwCMWaz-O7G2cDFwMKUHv7bhoNNvzlyE'; // 'AIzaSyBVsBh7IhYPwtLlwT-uXtUc93igm-kCK5Q';
window.hlx.GOOGLE_CLIENT_ID =
  '956110695353-mtphlsgook8dtni1f2k31anb5j4bj1r5.apps.googleusercontent.com';
// '1030667045458-rq7ch36ni575fe662o795duiepso39hf.apps.googleusercontent.com';

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  // eslint-disable-next-line no-bitwise
  if (
    h1 &&
    picture &&
    h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING
  ) {
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, h1] }));
    main.prepend(section);
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}
/**
 * adds specific css style for main page
 *
 * @param {element} main
 */
function decorateBackground(main) {
  const url = window.location.href;
  if (url.endsWith('/main')) {
    main.style.background = 'none';
    main.style.maxWidth = '1440px';
    main.style.margin = 'auto';
  }
}
/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
  decorateAnchors(main);
  decorateBackground(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const body = doc.querySelector('body');
  body.className = `page${window.location.pathname.replaceAll('/', '-')}`;
  const main = doc.querySelector('main');
  if (main) {
    main.className = `page${window.location.pathname.replaceAll('/', '-')}`;
    decorateMain(main);
    await waitForLCP(LCP_BLOCKS);
  }
}

/**
 * Adds the favicon.
 * @param {string} href The favicon URL
 */
export function addFavIcon(href) {
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/svg+xml';
  link.href = href;
  const existingLink = document.querySelector('head link[rel="icon"]');
  if (existingLink) {
    existingLink.parentElement.replaceChild(link, existingLink);
  } else {
    document.getElementsByTagName('head')[0].appendChild(link);
  }
}

function loadGlobalComponents(doc) {
  const { pathname } = window.location;

  if (!ROUTES_WITHOUT_HEADER.includes(pathname)) {
    loadHeader(doc.querySelector('header'));
  }
  if (!ROUTES_WITHOUT_USER_DAY_INFO.includes(pathname)) {
    loadUserDayInfo(doc.querySelector('#user-day-info'));
  }
  if (!ROUTES_WITHOUT_SIDEBAR.includes(pathname)) {
    loadSidebar(doc.querySelector('#sidebar'));
  }
  if (!ROUTES_WITHOUT_FOOTER.includes(pathname)) {
    loadFooter(doc.querySelector('footer'));
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  doc.className = `page${window.location.pathname.replaceAll('/', '-')}`;
  const main = doc.querySelector('main');
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();
  loadGlobalComponents(doc);

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  addFavIcon(`${window.hlx.codeBasePath}/styles/favicon.svg`);
  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

/**
 * Auth Check in route;
 */
async function checkRoute() {
  const path = window.location.pathname;

  if (GLOBAL_COMPONENT_ROUTES.includes(path)) {
    redirectTo(ROUTES.home);
    return;
  }

  try {
    setAWSStore();
    setInitialAWSConfigs();
    await fetchUser();
    const userRole = getUserRole();

    if (
      UN_AUTH_ROUTES.includes(path) ||
      (userRole?.role !== USER_ROLES.admin && ADMIN_ROUTES.includes(path))
    ) {
      redirectTo(ROUTES.home);
    }
  } catch (error) {
    const user = getUser();
    if (!user && path === ROUTES.home) {
      redirectTo(ROUTES.main);
    } else if (!user && PRIVATE_ROUTES.includes(path)) {
      redirectTo(ROUTES.signIn, { redirect_url: path });
    } else {
      // eslint-disable-next-line no-console
      console.log(error);
    }
    removeTokens();
    resetAWSConfigs();
  }
}

async function loadPage() {
  await checkRoute();
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();

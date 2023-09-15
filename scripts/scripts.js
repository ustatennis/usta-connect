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

window.hlx.RUM_GENERATION = 'media-only'; // add your RUM generation information here
window.hlx.CLIENT_ID = 'd6t7eioir35hn04f5c6n24kuv'; // temporary setting clientID here
window.hlx.USER_POOL_ID = 'us-east-1_y4oy4EoxU'; // temporary setting userPoolID here
window.hlx.IDENTITY_POOL_ID = 'us-east-1:0615f9dc-3f38-45c3-9342-78a464163f75'; // temporary setting userPoolID here

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

import { logOut } from '../../middleware/auth.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import {
  getUser,
  isAdminUser,
  isFacilityGroupMember,
} from '../../store/userStore.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector(
      '[aria-expanded="true"]',
    );
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-sections > ul > li').forEach(section => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded =
    forceExpanded !== null
      ? !forceExpanded
      : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = expanded || isDesktop.matches ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(
    navSections,
    expanded || isDesktop.matches ? 'false' : 'true',
  );
  button.setAttribute(
    'aria-label',
    expanded ? 'Open navigation' : 'Close navigation',
  );
  // enable nav dropdown keyboard accessibility
  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach(drop => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('role', 'button');
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach(drop => {
      drop.removeAttribute('role');
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }
  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
  }
}

function createLogoutButton() {
  const buttonWrapper = document.createElement('div');
  buttonWrapper.className = 'log-out';
  const logoutButton = document.createElement('button');
  logoutButton.textContent = 'Log out';
  logoutButton.addEventListener('click', logOut);
  buttonWrapper.append(logoutButton);
  return buttonWrapper;
}

/**
 * decorates the sidebar
 * @param {Element} block The sidebar block element
 */
export default async function decorate(block) {
  // fetch sidebar content
  const sidebarPath = '/sidebar';
  const resp = await fetch(
    `${sidebarPath}.plain.html`,
    window.location.pathname.endsWith('/sidebar') ? { cache: 'reload' } : {},
  );
  if (resp.ok) {
    const html = await resp.text();
    const nav = document.createElement('nav');
    const bodytag = document.getElementsByTagName('body')[0];
    nav.id = 'nav';
    nav.innerHTML = html;
    // const alllinks = nav.querySelectorAll('a');
    const urlPath = window.location.pathname;
    bodytag.className +=
      urlPath !== '/' ? ` page${urlPath.replace('/', '-')}` : 'page-home';
    // alllinks.forEach((l, i) => {
    //   const linkPath = new URL(l.href);
    //   if (linkPath.pathname === urlPath) {
    //     alllinks[i].parentElement.parentElement.className = 'selected';
    //   }
    //   if (linkPath.host !== window.location.host) {
    //     if (l.target === '') {
    //       l.target = '_blank';
    //     }
    //   }
    // });

    if (isAdminUser()) bodytag.className += ' role-admin';
    else bodytag.className += ' role-user';

    const nnn = nav.querySelectorAll('a[href*="/users"]');
    if (!isAdminUser() && nnn.length > 0) {
      nnn[0].parentElement.parentElement.className += 'disabled';
      nnn.forEach((l, i) => {
        nnn[i].className = 'disabled';
      });
    }

    const marketingTriggerNav = nav.querySelectorAll(
      'a[href*="/marketing-triggers"]',
    );
    if (!isAdminUser() && marketingTriggerNav.length > 0) {
      marketingTriggerNav[0].parentElement.parentElement.className +=
        'disabled';
      nnn.forEach((l, i) => {
        nnn[i].className = 'disabled';
      });
    }

    const marketingTriggerDashboardNav = nav.querySelectorAll(
      'a[href*="/marketing-trigger-dashboard"]',
    );
    if (!isAdminUser() && marketingTriggerDashboardNav.length > 0) {
      marketingTriggerDashboardNav[0].parentElement.parentElement.className +=
        'disabled';
      nnn.forEach((l, i) => {
        nnn[i].className = 'disabled';
      });
    }

    const faciltyNav = nav.querySelectorAll('a[href*="/facility-search"]');
    if (faciltyNav && !isFacilityGroupMember()) {
      faciltyNav[0].parentElement.parentElement.className += 'disabled';
      faciltyNav.forEach((l, i) => {
        faciltyNav[i].className = 'disabled';
      });
    }

    const classes = ['brand', 'sections', 'auth', 'tools'];
    classes.forEach((c, i) => {
      const section = nav.children[i];
      if (section) section.classList.add(`nav-${c}`);
    });

    const navSections = nav.querySelector('.nav-sections');
    // if (navSections) {
    //   navSections.querySelectorAll(':scope > ul > li').forEach(navSection => {
    //     if (navSection.querySelector('ul'))
    //       navSection.classList.add('nav-drop');
    //     navSection.addEventListener('click', () => {
    //       if (isDesktop.matches) {
    //         const expanded =
    //           navSection.getAttribute('aria-expanded') === 'true';
    //         toggleAllNavSections(navSections);
    //         navSection.setAttribute(
    //           'aria-expanded',
    //           expanded ? 'false' : 'true',
    //         );
    //       }
    //     });
    //   });
    // }

    const authSections = nav.querySelector('.nav-auth');
    if (authSections) {
      const user = getUser();
      if (user) {
        authSections.querySelectorAll('p').forEach(elem => {
          elem.classList.add('none');
        });
        const logoutButton = createLogoutButton();
        authSections.append(logoutButton);
      }
    }

    // hamburger for mobile
    const hamburger = document.createElement('div');
    hamburger.classList.add('nav-hamburger');
    hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
        <span class="nav-hamburger-icon"></span>
      </button>`;
    hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
    // nav.prepend(hamburger);
    nav.setAttribute('aria-expanded', 'true');
    // prevent mobile nav behavior on window resize
    // toggleMenu(nav, navSections, isDesktop.matches);
    // isDesktop.addEventListener('change', () =>
    //   toggleMenu(nav, navSections, isDesktop.matches),
    // );

    decorateIcons(nav);
    const navWrapper = document.createElement('div');
    navWrapper.className = 'nav-wrapper';
    navWrapper.append(nav);
    block.append(navWrapper);
  }
}

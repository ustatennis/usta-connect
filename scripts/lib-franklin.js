const ICON_ROOT = '/icons';

/**
 * log RUM if part of the sample.
 * @param {string} checkpoint identifies the checkpoint in funnel
 * @param {Object} data additional data for RUM sample
 */
export function sampleRUM(checkpoint, data = {}) {
  sampleRUM.defer = sampleRUM.defer || [];
  const defer = fnname => {
    sampleRUM[fnname] =
      sampleRUM[fnname] ||
      ((...args) => sampleRUM.defer.push({ fnname, args }));
  };
  sampleRUM.drain =
    sampleRUM.drain ||
    ((dfnname, fn) => {
      sampleRUM[dfnname] = fn;
      sampleRUM.defer
        .filter(({ fnname }) => dfnname === fnname)
        .forEach(({ fnname, args }) => sampleRUM[fnname](...args));
    });
  sampleRUM.on = (chkpnt, fn) => {
    sampleRUM.cases[chkpnt] = fn;
  };
  defer('observe');
  defer('cwv');
  try {
    window.hlx = window.hlx || {};
    if (!window.hlx.rum) {
      const usp = new URLSearchParams(window.location.search);
      const weight = usp.get('rum') === 'on' ? 1 : 100; // with parameter, weight is 1. Defaults to 100.
      // eslint-disable-next-line no-bitwise
      const hashCode = s =>
        s.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);
      const id = `${hashCode(
        window.location.href,
      )}-${new Date().getTime()}-${Math.random().toString(16).substr(2, 14)}`;
      const random = Math.random();
      const isSelected = random * weight < 1;
      // eslint-disable-next-line object-curly-newline
      window.hlx.rum = {
        weight,
        id,
        random,
        isSelected,
        sampleRUM,
      };
    }
    const { weight, id } = window.hlx.rum;
    if (window.hlx && window.hlx.rum && window.hlx.rum.isSelected) {
      const sendPing = (pdata = data) => {
        // eslint-disable-next-line object-curly-newline, max-len, no-use-before-define
        const body = JSON.stringify({
          weight,
          id,
          referer: window.location.href,
          generation: window.hlx.RUM_GENERATION,
          checkpoint,
          ...data,
        });
        const url = `https://rum.hlx.page/.rum/${weight}`;
        // eslint-disable-next-line no-unused-expressions
        navigator.sendBeacon(url, body);
        // eslint-disable-next-line no-console
        console.debug(`ping:${checkpoint}`, pdata);
      };
      sampleRUM.cases = sampleRUM.cases || {
        cwv: () => sampleRUM.cwv(data) || true,
        lazy: () => {
          // use classic script to avoid CORS issues
          const script = document.createElement('script');
          script.src =
            'https://rum.hlx.page/.rum/@adobe/helix-rum-enhancer@^1/src/index.js';
          document.head.appendChild(script);
          return true;
        },
      };
      sendPing(data);
      if (sampleRUM.cases[checkpoint]) {
        sampleRUM.cases[checkpoint]();
      }
    }
  } catch (error) {
    // something went wrong
  }
}

/**
 * Loads a CSS file.
 * @param {string} href The path to the CSS file
 */
export function loadCSS(href, callback) {
  if (!document.querySelector(`head > link[href="${href}"]`)) {
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', href);
    if (typeof callback === 'function') {
      link.onload = e => callback(e.type);
      link.onerror = e => callback(e.type);
    }
    document.head.appendChild(link);
  } else if (typeof callback === 'function') {
    callback('noop');
  }
}

/**
 * Retrieves the content of metadata tags.
 * @param {string} name The metadata name (or property)
 * @returns {string} The metadata value(s)
 */
export function getMetadata(name) {
  const attr = name && name.includes(':') ? 'property' : 'name';
  const meta = [...document.head.querySelectorAll(`meta[${attr}="${name}"]`)]
    .map(m => m.content)
    .join(', ');
  return meta || '';
}

/**
 * Sanitizes a string for use as class name.
 * @param {string} name The unsanitized string
 * @returns {string} The class name
 */
export function toClassName(name) {
  return typeof name === 'string'
    ? name
        .toLowerCase()
        .replace(/[^0-9a-z]/gi, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
    : '';
}

/**
 * Sanitizes a string for use as a js property name.
 * @param {string} name The unsanitized string
 * @returns {string} The camelCased name
 */
export function toCamelCase(name) {
  return toClassName(name).replace(/-([a-z])/g, g => g[1].toUpperCase());
}

// const ICONS_CACHE = {};
/**
 * Replace icons with inline SVG and prefix with codeBasePath.
 * @param {Element} [element] Element containing icons
 */
// export async function decorateIcons(element) {
//   // Prepare the inline sprite
//   let svgSprite = document.getElementById('franklin-svg-sprite');
//   if (!svgSprite) {
//     const div = document.createElement('div');
//     div.innerHTML =
//       '<svg xmlns="http://www.w3.org/2000/svg" id="franklin-svg-sprite" style="display: none"></svg>';
//     svgSprite = div.firstElementChild;
//     document.body.append(div.firstElementChild);
//   }

//   // Download all new icons
//   const icons = [...element.querySelectorAll('span.icon')];
//   await Promise.all(
//     icons.map(async span => {
//       const iconName = Array.from(span.classList)
//         .find(c => c.startsWith('icon-'))
//         .substring(5);
//       if (!ICONS_CACHE[iconName]) {
//         ICONS_CACHE[iconName] = true;
//         try {
//           const response = await fetch(
//             `${window.hlx.codeBasePath}/icons/${iconName}.svg`,
//           );
//           if (!response.ok) {
//             ICONS_CACHE[iconName] = false;
//             return;
//           }
//           // Styled icons don't play nice with the sprite approach because of shadow dom isolation
//           const svg = await response.text();
//           if (svg.match(/(<style | class=)/)) {
//             ICONS_CACHE[iconName] = {
//               styled: true,
//               html: svg,
//             };
//           } else {
//             ICONS_CACHE[iconName] = {
//               html: svg
//                 .replace('<svg', `<symbol id="icons-sprite-${iconName}"`)
//                 .replace(/ width=".*?"/, '')
//                 .replace(/ height=".*?"/, '')
//                 .replace('</svg>', '</symbol>'),
//             };
//           }
//         } catch (error) {
//           ICONS_CACHE[iconName] = false;
//           // eslint-disable-next-line no-console
//           console.error(error);
//         }
//       }
//     }),
//   );

//   const symbols = Object.values(ICONS_CACHE)
//     .filter(v => !v.styled)
//     .map(v => v.html)
//     .join('\n');
//   svgSprite.innerHTML += symbols;

//   icons.forEach(span => {
//     const iconName = Array.from(span.classList)
//       .find(c => c.startsWith('icon-'))
//       .split('-')[1];
//     const parent =
//       span.firstElementChild?.tagName === 'A' ? span.firstElementChild : span;
//     // Styled icons need to be inlined as-is, while unstyled ones can leverage the sprite
//     if (ICONS_CACHE[iconName].styled) {
//       parent.innerHTML = ICONS_CACHE[iconName].html;
//     } else {
//       parent.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg"><use href="#${iconName}"/></svg>`;
//     }
//   });
// }

/**
 * Replace icons with inline SVG and prefix with codeBasePath.
 * @param {Element} element
 */
export function decorateIcons(element = document) {
  element.querySelectorAll('span.icon').forEach(async span => {
    if (span.classList.length < 2 || !span.classList[1].startsWith('icon-')) {
      return;
    }
    const icon = span.classList[1].substring(5);
    // eslint-disable-next-line no-use-before-define
    const resp = await fetch(
      `${window.hlx.codeBasePath}${ICON_ROOT}/${icon}.svg`,
    );
    if (resp.ok) {
      const iconHTML = await resp.text();
      if (iconHTML.match(/<style/i)) {
        const img = document.createElement('img');
        img.src = `data:image/svg+xml,${encodeURIComponent(iconHTML)}`;
        span.appendChild(img);
      } else {
        span.innerHTML = iconHTML;
      }
    }
  });
}

/**
 * Retrieves an SVG icon from the specified path and returns an `svg` element.
 *
 * @param {string} iconName - The name of the SVG icon file.
 * @param {number} [width=24] - The width of the `svg` element (in pixels).
 * @param {number} [height=24] - The height of the `svg` element (in pixels).
 * @returns {SVGElement|null} - The `svg` element for the retrieved SVG icon, or null if the icon is not found.
 */
export function getIcon(iconName, width = 24, height = 24) {
  const request = new XMLHttpRequest();
  request.open(
    'GET',
    `${window.hlx.codeBasePath}/icons/${iconName}.svg`,
    false,
  );
  request.send();

  if (request.status !== 200) {
    return null;
  }

  const svgText = request.responseText;
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
  const svgElement = svgDoc.documentElement;
  svgElement.setAttribute('width', width);
  svgElement.setAttribute('height', height);

  return svgElement;
}

/**
 * Gets placeholders object.
 * @param {string} [prefix] Location of placeholders
 * @returns {object} Window placeholders object
 */
export async function fetchPlaceholders(prefix = 'default') {
  window.placeholders = window.placeholders || {};
  const loaded = window.placeholders[`${prefix}-loaded`];
  if (!loaded) {
    window.placeholders[`${prefix}-loaded`] = new Promise((resolve, reject) => {
      try {
        fetch(`${prefix === 'default' ? '' : prefix}/placeholders.json`)
          .then(resp => resp.json())
          .then(json => {
            const placeholders = {};
            json.data.forEach(placeholder => {
              placeholders[toCamelCase(placeholder.Key)] = placeholder.Text;
            });
            window.placeholders[prefix] = placeholders;
            resolve();
          });
      } catch (error) {
        // error loading placeholders
        window.placeholders[prefix] = {};
        reject();
      }
    });
  }
  await window.placeholders[`${prefix}-loaded`];
  return window.placeholders[prefix];
}

/**
 * Decorates a block.
 * @param {Element} block The block element
 */
export function decorateBlock(block) {
  const shortBlockName = block.classList[0];
  if (shortBlockName) {
    block.classList.add('block');
    block.dataset.blockName = shortBlockName;
    block.dataset.blockStatus = 'initialized';
    const blockWrapper = block.parentElement;
    blockWrapper?.classList.add(`${shortBlockName}-wrapper`);
    const section = block.closest('.section');
    if (section) section.classList.add(`${shortBlockName}-container`);
  }
}

/**
 * Extracts the config from a block.
 * @param {Element} block The block element
 * @returns {object} The block config
 */
export function readBlockConfig(block) {
  const config = {};
  block.querySelectorAll(':scope > div').forEach(row => {
    if (row.children) {
      const cols = [...row.children];
      if (cols[1]) {
        const col = cols[1];
        const name = toClassName(cols[0].textContent);
        let value = '';
        if (col.querySelector('a')) {
          const as = [...col.querySelectorAll('a')];
          if (as.length === 1) {
            value = as[0].href;
          } else {
            value = as.map(a => a.href);
          }
        } else if (col.querySelector('img')) {
          const imgs = [...col.querySelectorAll('img')];
          if (imgs.length === 1) {
            value = imgs[0].src;
          } else {
            value = imgs.map(img => img.src);
          }
        } else if (col.querySelector('p')) {
          const ps = [...col.querySelectorAll('p')];
          if (ps.length === 1) {
            value = ps[0].textContent;
          } else {
            value = ps.map(p => p.textContent);
          }
        } else value = row.children[1].textContent;
        config[name] = value;
      }
    }
  });
  return config;
}

/**
 * Decorates all sections in a container element.
 * @param {Element} main The container element
 */
export function decorateSections(main) {
  main.querySelectorAll(':scope > div').forEach(section => {
    const wrappers = [];
    let defaultContent = false;
    [...section.children].forEach(e => {
      if (e.tagName === 'DIV' || !defaultContent) {
        const wrapper = document.createElement('div');
        wrappers.push(wrapper);
        defaultContent = e.tagName !== 'DIV';
        if (defaultContent) wrapper.classList.add('default-content-wrapper');
      }
      wrappers[wrappers.length - 1].append(e);
    });
    wrappers.forEach(wrapper => section.append(wrapper));
    section.classList.add('section');
    section.dataset.sectionStatus = 'initialized';
    section.style.display = 'none';

    /* process section metadata */
    const sectionMeta = section.querySelector('div.section-metadata');
    if (sectionMeta) {
      const meta = readBlockConfig(sectionMeta);
      Object.keys(meta).forEach(key => {
        if (key === 'style') {
          const styles = meta.style
            .split(',')
            .map(style => toClassName(style.trim()));
          styles.forEach(style => section.classList.add(style));
        } else {
          section.dataset[toCamelCase(key)] = meta[key];
        }
      });
      sectionMeta.parentNode.remove();
    }
  });
}

/**
 * Updates all section status in a container element.
 * @param {Element} main The container element
 */
export function updateSectionsStatus(main) {
  const sections = [...main.querySelectorAll(':scope > div.section')];
  for (let i = 0; i < sections.length; i += 1) {
    const section = sections[i];
    const status = section.dataset.sectionStatus;
    if (status !== 'loaded') {
      const loadingBlock = section.querySelector(
        '.block[data-block-status="initialized"], .block[data-block-status="loading"]',
      );
      if (loadingBlock) {
        section.dataset.sectionStatus = 'loading';
        break;
      } else {
        section.dataset.sectionStatus = 'loaded';
        section.style.display = null;
      }
    }
  }
}

/**
 * Decorates all blocks in a container element.
 * @param {Element} main The container element
 */
export function decorateBlocks(main) {
  main.querySelectorAll('div.section > div > div').forEach(decorateBlock);
}

/**
 * Builds a block DOM Element from a two dimensional array, string, or object
 * @param {string} blockName name of the block
 * @param {*} content two dimensional array or string or object of content
 */
export function buildBlock(blockName, content) {
  const table = Array.isArray(content) ? content : [[content]];
  const blockEl = document.createElement('div');
  // build image block nested div structure
  blockEl.classList.add(blockName);
  table.forEach(row => {
    const rowEl = document.createElement('div');
    row.forEach(col => {
      const colEl = document.createElement('div');
      const vals = col.elems ? col.elems : [col];
      vals.forEach(val => {
        if (val) {
          if (typeof val === 'string') {
            colEl.innerHTML += val;
          } else {
            colEl.appendChild(val);
          }
        }
      });
      rowEl.appendChild(colEl);
    });
    blockEl.appendChild(rowEl);
  });
  return blockEl;
}

/**
 * Loads JS and CSS for a block.
 * @param {Element} block The block element
 */
export async function loadBlock(block) {
  const status = block.dataset.blockStatus;
  if (status !== 'loading' && status !== 'loaded') {
    block.dataset.blockStatus = 'loading';
    const { blockName } = block.dataset;
    try {
      const cssLoaded = new Promise(resolve => {
        loadCSS(
          `${window.hlx.codeBasePath}/styles/css/${blockName}/${blockName}.css`,
          resolve,
        );
        loadCSS(`${window.hlx.codeBasePath}/styles/css/global.css`, resolve);
      });
      const decorationComplete = new Promise(resolve => {
        (async () => {
          try {
            const mod = await import(`../blocks/${blockName}/${blockName}.js`);
            if (mod.default) {
              await mod.default(block);
            }
          } catch (error) {
            // eslint-disable-next-line no-console
            console.log(`failed to load module for ${blockName}`, error);
          }
          resolve();
        })();
      });
      await Promise.all([cssLoaded, decorationComplete]);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(`failed to load block ${blockName}`, error);
    }
    block.dataset.blockStatus = 'loaded';
  }
}

/**
 * Loads JS and CSS for all blocks in a container element.
 * @param {Element} main The container element
 */
export async function loadBlocks(main) {
  updateSectionsStatus(main);
  const blocks = [...main.querySelectorAll('div.block')];
  for (let i = 0; i < blocks.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await loadBlock(blocks[i]);
    updateSectionsStatus(main);
  }
}

/**
 * Returns a picture element with webp and fallbacks
 * @param {string} src The image URL
 * @param {string} [alt] The image alternative text
 * @param {boolean} [eager] Set loading attribute to eager
 * @param {Array} [breakpoints] Breakpoints and corresponding params (eg. width)
 * @returns {Element} The picture element
 */
export function createOptimizedPicture(
  src,
  alt = 'picture',
  eager = false,
  breakpoints = [
    { media: '(min-width: 400px)', width: '750' },
    { width: '750' },
  ],
) {
  const url = new URL(src, window.location.href);
  const picture = document.createElement('picture');
  const { pathname } = url;
  const ext = pathname.substring(pathname.lastIndexOf('.') + 1);

  // webp
  breakpoints.forEach(br => {
    const source = document.createElement('source');
    if (br.media) source.setAttribute('media', br.media);
    source.setAttribute('type', 'image/webp');
    source.setAttribute(
      'srcset',
      `${pathname}?width=${br.width}&format=webply&optimize=medium`,
    );
    picture.appendChild(source);
  });

  // fallback
  breakpoints.forEach((br, i) => {
    if (i < breakpoints.length - 1) {
      const source = document.createElement('source');
      if (br.media) source.setAttribute('media', br.media);
      source.setAttribute(
        'srcset',
        `${pathname}?width=${br.width}&format=${ext}&optimize=medium`,
      );
      picture.appendChild(source);
    } else {
      const img = document.createElement('img');
      img.setAttribute('loading', eager ? 'eager' : 'lazy');
      img.setAttribute('alt', alt);
      if (br.width) {
        img.width = br.width;
      }
      if (br.height) {
        img.height = br.height;
      }
      picture.appendChild(img);
      img.setAttribute(
        'src',
        `${pathname}?width=${br.width}&format=${ext}&optimize=medium`,
      );
    }
  });

  return picture;
}

/**
 * Normalizes all headings within a container element.
 * @param {Element} el The container element
 * @param {string} allowedHeadings The list of allowed headings (h1 ... h6)
 */
export function normalizeHeadings(el, allowedHeadings) {
  const allowed = allowedHeadings.map(h => h.toLowerCase());
  el.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(tag => {
    const h = tag.tagName.toLowerCase();
    if (allowed.indexOf(h) === -1) {
      // current heading is not in the allowed list -> try first to "promote" the heading
      let level = parseInt(h.charAt(1), 10) - 1;
      while (allowed.indexOf(`h${level}`) === -1 && level > 0) {
        level -= 1;
      }
      if (level === 0) {
        // did not find a match -> try to "downgrade" the heading
        while (allowed.indexOf(`h${level}`) === -1 && level < 7) {
          level += 1;
        }
      }
      if (level !== 7) {
        tag.outerHTML = `<h${level} id="${tag.id}">${tag.textContent}</h${level}>`;
      }
    }
  });
}

/**
 * Set template (page structure) and theme (page styles).
 */
export function decorateTemplateAndTheme() {
  const addClasses = (element, classes) => {
    classes.split(',').forEach(c => {
      element.classList.add(toClassName(c.trim()));
    });
  };
  const template = getMetadata('template');
  if (template) addClasses(document.body, template);
  const theme = getMetadata('theme');
  if (theme) addClasses(document.body, theme);
}

/**
 * update Links.
 */

export function decorateAnchors(element) {
  element.querySelectorAll('a').forEach(a => {
    if (a.getAttribute('href').charAt(0) === '#') return;
    if (a.getAttribute('href').charAt(0) === '/') {
      if (a.target = '_blank') {
        a.target = '_self';
      }
      return
    };
    const linkPath = new URL(a.href);
    if (linkPath.origin !== window.location.origin) {
      if (a.target === '') {
        a.target = '_blank';
      }
    }
  });
}

/**
 * Decorates paragraphs containing a single link as buttons.
 * @param {Element} element container element
 */
export function decorateButtons(element) {
  element.querySelectorAll('a').forEach(a => {
    a.target = '_blank';
  });
  // element.querySelectorAll('a').forEach(a => {
  //   a.title = a.title || a.textContent;
  //   if (a.href !== a.textContent) {
  //     const up = a.parentElement;
  //     const twoup = a.parentElement.parentElement;
  //     if (!a.querySelector('img')) {
  //       if (
  //         up.childNodes.length === 1 &&
  //         (up.tagName === 'P' || up.tagName === 'DIV')
  //       ) {
  //         a.className = 'button primary'; // default
  //         up.classList.add('button-container');
  //       }
  //       if (
  //         up.childNodes.length === 1 &&
  //         up.tagName === 'STRONG' &&
  //         twoup.childNodes.length === 1 &&
  //         twoup.tagName === 'P'
  //       ) {
  //         a.className = 'button primary';
  //         twoup.classList.add('button-container');
  //       }
  //       if (
  //         up.childNodes.length === 1 &&
  //         up.tagName === 'EM' &&
  //         twoup.childNodes.length === 1 &&
  //         twoup.tagName === 'P'
  //       ) {
  //         a.className = 'button secondary';
  //         twoup.classList.add('button-container');
  //       }
  //     }
  //   }
  // });
}

/**
 * Load LCP block and/or wait for LCP in default content.
 */
export async function waitForLCP(lcpBlocks) {
  const block = document.querySelector('.block');
  const hasLCPBlock = block && lcpBlocks.includes(block.dataset.blockName);
  if (hasLCPBlock) await loadBlock(block);

  document.body.style.display = null;
  const lcpCandidate = document.querySelector('main img');
  await new Promise(resolve => {
    if (lcpCandidate && !lcpCandidate.complete) {
      lcpCandidate.setAttribute('loading', 'eager');
      lcpCandidate.addEventListener('load', resolve);
      lcpCandidate.addEventListener('error', resolve);
    } else {
      resolve();
    }
  });
}

/**
 * Loads a block named 'header' into header
 * @param {Element} header header element
 * @returns {Promise}
 */
export function loadHeader(header) {
  const headerBlock = buildBlock('header', '');
  header.append(headerBlock);
  decorateBlock(headerBlock);
  return loadBlock(headerBlock);
}

/**
 * Loads a block named 'user-day-info' into header
 * @param {Element} section user day info element
 * @returns {Promise}
 */
export function loadUserDayInfo(section) {
  const userDayInfoBlock = buildBlock('user-day-info', '');
  section?.append(userDayInfoBlock);
  decorateBlock(userDayInfoBlock);
  decorateAnchors(userDayInfoBlock);
  return loadBlock(userDayInfoBlock);
}

/**
 * Loads a block named 'sidebar' into aside
 * @param {Element} aside sidebar element
 * @returns {Promise}
 */
export function loadSidebar(aside) {
  const sidebarBlock = buildBlock('sidebar', '');
  aside?.append(sidebarBlock);
  decorateBlock(sidebarBlock);
  return loadBlock(sidebarBlock);
}

/**
 * Loads a block named 'footer' into footer
 * @param footer footer element
 * @returns {Promise}
 */
export function loadFooter(footer) {
  const footerBlock = buildBlock('footer', '');
  footer.append(footerBlock);
  decorateBlock(footerBlock);
  return loadBlock(footerBlock);
}

/**
 * Setup block utils.
 */
export function setup() {
  window.hlx = window.hlx || {};
  window.hlx.codeBasePath = '';
  window.hlx.lighthouse =
    new URLSearchParams(window.location.search).get('lighthouse') === 'on';

  const scriptEl = document.querySelector('script[src$="/scripts/scripts.js"]');
  if (scriptEl) {
    try {
      [window.hlx.codeBasePath] = new URL(scriptEl.src).pathname.split(
        '/scripts/scripts.js',
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }
}

function appendGlobalElements() {
  const section = document.createElement('section');
  section.id = 'user-day-info';
  const aside = document.createElement('aside');
  aside.id = 'sidebar';

  const header = document.querySelector('header');
  header.insertAdjacentElement('afterend', section);
  section.insertAdjacentElement('afterend', aside);
}

/**
 * Auto initializiation.
 */
function init() {
  document.body.style.display = 'none';
  setup();
  sampleRUM('top');

  window.addEventListener('load', () => {
    appendGlobalElements();
    sampleRUM('load');
  });

  window.addEventListener('unhandledrejection', event => {
    sampleRUM('error', {
      source: event.reason.sourceURL,
      target: event.reason.line,
    });
  });

  window.addEventListener('error', event => {
    sampleRUM('error', {
      source: event.filename,
      target: event.lineno,
    });
  });
}

init();

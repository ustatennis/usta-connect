import { createOptimizedPicture, getIcon } from '../../scripts/lib-franklin.js';
import { buildUrl, getQueryParams, redirectTo } from '../../scripts/helpers.js';
import { logIn } from '../../middleware/auth.js';

function createPasswordInput() {
  const passwordWrapper = document.createElement('div');
  passwordWrapper.classList.add('password-wrapper');

  const passwordLabel = document.createElement('label');
  passwordLabel.setAttribute('for', 'password');
  passwordLabel.innerText = 'Password';
  passwordLabel.required = true;

  const passwordInputWrapper = document.createElement('div');
  passwordInputWrapper.classList.add('password-input-wrapper');

  const passwordInput = document.createElement('input');
  passwordInput.setAttribute('type', 'password');
  passwordInput.setAttribute('placeholder', 'Password');
  passwordInput.setAttribute('name', 'password');
  passwordInputWrapper.appendChild(passwordInput);

  const eyeIcon = getIcon('eye');
  const eyeSlashIcon = getIcon('eye-slash');

  const showPasswordButton = document.createElement('button');
  showPasswordButton.setAttribute('aria-label', 'show password button');
  showPasswordButton.innerText = '';
  showPasswordButton.append(eyeIcon);
  showPasswordButton.classList.add('show-password-button');
  passwordInputWrapper.appendChild(showPasswordButton);

  showPasswordButton.addEventListener('click', () => {
    if (passwordInput.getAttribute('type') === 'password') {
      passwordInput.setAttribute('type', 'text');
      showPasswordButton.innerText = '';
      showPasswordButton.append(eyeSlashIcon);
    } else {
      passwordInput.setAttribute('type', 'password');
      showPasswordButton.innerText = '';
      showPasswordButton.append(eyeIcon);
    }
  });

  passwordLabel.appendChild(passwordInputWrapper);
  passwordWrapper.appendChild(passwordLabel);

  return passwordWrapper;
}

function createUsernameInput() {
  const usernameWrapper = document.createElement('div');
  usernameWrapper.classList.add('username-wrapper');

  const usernameLabel = document.createElement('label');
  usernameLabel.setAttribute('for', 'email');
  usernameLabel.innerText = 'Username';
  usernameWrapper.appendChild(usernameLabel);

  const usernameDiv = document.createElement('div');
  usernameDiv.classList.add('username-input');
  usernameLabel.appendChild(usernameDiv);

  const usernameInput = document.createElement('input');
  usernameInput.setAttribute('name', 'email');
  //  usernameInput.setAttribute('placeholder', 'name@host.com');
  usernameInput.required = true;
  usernameDiv.appendChild(usernameInput);

  return usernameWrapper;
}

function openInitialAuthorizationModal() {
  const initialAuthorization = document.querySelector(
    '.initial-auth-container',
  );
  const signInModalForm = document.querySelector('.sign-in-container');
  initialAuthorization.classList.remove('none');
  signInModalForm.classList.add('none');
}

async function onSignInClick() {
  const username = document.querySelector('input[name="email"]');
  const password = document.querySelector('input[name="password"]');

  if (!username.reportValidity()) return;
  if (!password.reportValidity()) return;

  const signInButton = document.querySelector('#signInButton');
  signInButton.disabled = true;
  signInButton.innerText = '';
  signInButton.classList.add('loading');

  try {
    const data = await logIn(username.value, password.value);
    if (data?.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
      openInitialAuthorizationModal();
    } else {
      const query = getQueryParams();
      redirectTo(query?.redirect_url || '/');
    }
  } catch (err) {
    const errorMessage = document.querySelector('.sign-in-err-msg');
    errorMessage.style.display = 'block';
    if (err?.message) errorMessage.innerText = err.message;
  } finally {
    signInButton.disabled = false;
    signInButton.classList.remove('loading');
    signInButton.innerText = 'Sign In';
  }
}

function createSignInButton() {
  const signInWrapper = document.createElement('div');
  signInWrapper.classList.add('sign-in-button-wrapper');
  const signInButton = document.createElement('button');
  signInButton.setAttribute('type', 'submit');
  signInButton.setAttribute('aria-label', 'sign in');
  signInButton.innerText = 'Sign In';
  signInButton.id = 'signInButton';
  signInButton.addEventListener('click', onSignInClick);
  signInWrapper.appendChild(signInButton);
  return signInWrapper;
}

function createForgotPasswordLink() {
  const link = document.createElement('a');
  const query = getQueryParams();
  link.href = buildUrl('/forgot-password', query);
  link.textContent = 'Forgot password?';

  const div = document.createElement('div');
  div.className = 'forgot-password-wrapper';
  div.appendChild(link);

  return div;
}

// function createSignUpLink() {
//   const span = document.createElement('span');
//   span.textContent = 'Need an Account?';

//   const link = document.createElement('a');
//   const query = getQueryParams();
//   link.href = buildUrl('/sign-up', query);
//   link.textContent = 'Sign Up';

//   const div = document.createElement('div');
//   div.classList.add('sign-up-link');
//   div.appendChild(span);
//   div.appendChild(link);

//   return div;
// }

function createSignInTitle() {
  const span = document.createElement('span');
  span.textContent = 'Sign in with your username and password';

  const div = document.createElement('div');
  div.classList.add('sign-in-title');
  div.appendChild(span);

  return div;
}

function createErrorMessage() {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'sign-in-err-msg';
  errorDiv.textContent = 'Something Went Wrong';
  return errorDiv;
}

export default function decorate(block) {
  const modalCover = document.createElement('div');
  modalCover.className = 'modal-cover';
  const modal = document.createElement('div');
  modal.className = 'modal';
  const form = document.createElement('div');
  form.className = 'form';

  const usernameInput = createUsernameInput();
  const passwordInput = createPasswordInput();
  const signInButton = createSignInButton();
  const forgotPasswordLink = createForgotPasswordLink();
  // const signUpLink = createSignUpLink();

  form.append(usernameInput, passwordInput, forgotPasswordLink, signInButton);
  modal.append(form);

  const logoWrapper = block.children[0].cloneNode(true);
  logoWrapper.className = 'logo-wrapper';
  logoWrapper
    .querySelectorAll('img')
    .forEach(img =>
      img
        .closest('picture')
        .replaceWith(
          createOptimizedPicture(img.src, img.alt, true, [
            { width: 300, height: 30 },
          ]),
        ),
    );

  const signInTitle = createSignInTitle();
  const errorMessage = createErrorMessage();

  block.textContent = '';
  block.append(logoWrapper, signInTitle, errorMessage, modal, modalCover);
}

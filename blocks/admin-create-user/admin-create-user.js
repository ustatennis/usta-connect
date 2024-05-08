import { adminCreateUser } from '../../middleware/admin.js';
import { getIcon } from '../../scripts/lib-franklin.js';
import {
  getPasswordValidationMessage,
  validatePasswordInput,
} from '../../validations/auth.js';
import { falseSign, signUpPasswordMessages } from '../../validations/rules.js';

function createUsernameInput() {
  const usernameWrapper = document.createElement('div');
  usernameWrapper.classList.add('username-wrapper');

  const usernameLabel = document.createElement('label');
  usernameLabel.setAttribute('for', 'username');
  usernameLabel.innerText = 'Username';
  usernameWrapper.appendChild(usernameLabel);

  const inputDescription = document.createElement('div');
  inputDescription.classList = 'input-description';
  const span = document.createElement('span');
  span.innerText = 'Provide a valid username';
  inputDescription.appendChild(span);

  const usernameDiv = document.createElement('div');
  usernameDiv.classList.add('username-input-wrapper');
  usernameLabel.append(inputDescription, usernameDiv);

  const usernameInput = document.createElement('input');
  usernameInput.setAttribute('name', 'username');
  usernameInput.setAttribute('placeholder', 'username');
  usernameInput.required = true;
  usernameDiv.appendChild(usernameInput);

  return usernameWrapper;
}

function createEmailAddressInput() {
  const usernameWrapper = document.createElement('div');
  usernameWrapper.classList.add('username-wrapper');

  const usernameLabel = document.createElement('label');
  usernameLabel.setAttribute('for', 'email');
  usernameLabel.innerText = 'Email address';
  usernameWrapper.appendChild(usernameLabel);

  const inputDescription = document.createElement('div');
  inputDescription.classList = 'input-description';
  const span = document.createElement('span');
  span.innerText =
    "Enter this user's email address. A user's email address can be used for sign-in, account recovery, and account confirmation.";
  inputDescription.appendChild(span);

  const usernameDiv = document.createElement('div');
  usernameDiv.classList.add('username-input-wrapper');
  usernameLabel.append(inputDescription, usernameDiv);

  const usernameInput = document.createElement('input');
  usernameInput.setAttribute('name', 'email');
  //usernameInput.setAttribute('placeholder', 'name@host.com');
  usernameInput.required = true;
  usernameDiv.appendChild(usernameInput);

  return usernameWrapper;
}

function validatePassword(e) {
  const value = e?.target?.value;
  const errorMessageKeys = validatePasswordInput(value);
  const errorMessages = getPasswordValidationMessage(
    errorMessageKeys,
    signUpPasswordMessages,
  );
  const messageDiv = document.querySelector('.create-user-pass-message');
  messageDiv.innerHTML = '';
  messageDiv.classList.remove('none');
  if (value) {
    messageDiv.classList.remove('none');
  } else {
    messageDiv.classList.add('none');
  }

  errorMessages.forEach(msg => {
    const span = document.createElement('span');
    if (msg.includes(falseSign)) {
      span.classList.add('error');
    } else span.classList.remove('error');
    span.textContent = msg;
    messageDiv.appendChild(span);
  });

  const hasError = errorMessages.some(msg => msg.includes(falseSign));
  const password = document.querySelector('input[name="password"]');
  if (hasError) {
    password.setCustomValidity("Password doesn't match the requirements");
  } else {
    password.setCustomValidity('');
  }
}

function createPasswordValidationMessage() {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'create-user-pass-message none';
  return messageDiv;
}

function createPasswordInput() {
  const passwordWrapper = document.createElement('div');
  passwordWrapper.classList.add('password-wrapper');

  const passwordLabel = document.createElement('label');
  passwordLabel.setAttribute('for', 'password');
  passwordLabel.innerText = 'Password';

  const passwordInputWrapper = document.createElement('div');
  passwordInputWrapper.classList.add('password-input-wrapper');

  const passwordInput = document.createElement('input');
  passwordInput.setAttribute('type', 'password');
  passwordInput.setAttribute('placeholder', 'Password');
  passwordInput.setAttribute('name', 'password');
  passwordInput.required = true;
  passwordInput.addEventListener('input', validatePassword);
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

  const inputDescription = document.createElement('div');
  inputDescription.classList = 'input-description';
  const span = document.createElement('span');
  span.innerText =
    'Enter a temporary password for this user. The temporary password will be sent to the user in their invitation message.';
  inputDescription.appendChild(span);

  passwordLabel.append(inputDescription, passwordInputWrapper);
  passwordWrapper.appendChild(passwordLabel);

  return passwordWrapper;
}

async function onCreateUserClick() {
  const username = document.querySelector('input[name="username"]');
  const email = document.querySelector('input[name="email"]');
  const password = document.querySelector('input[name="password"]');

  if (!username.reportValidity()) return;
  if (!email.reportValidity()) return;
  if (!password.reportValidity()) return;

  const createUserButton = document.querySelector('#createUserButton');
  createUserButton.disabled = true;
  createUserButton.innerText = '';
  createUserButton.classList.add('loading');

  try {
    await adminCreateUser(username.value, email.value, password.value);
    window.location.reload();
  } catch (err) {
    const errorMessage = document.querySelector('.create-user-err-msg');
    errorMessage.classList.remove('none');
    if (err?.message) errorMessage.innerText = err.message;
  } finally {
    createUserButton.disabled = false;
    createUserButton.classList.remove('loading');
    createUserButton.innerText = 'Create User';
  }
}

function adminCreateUserButton() {
  const createUserWrapper = document.createElement('div');
  createUserWrapper.classList.add('create-user-button-wrapper');
  const createUserButton = document.createElement('button');
  createUserButton.setAttribute('type', 'submit');
  createUserButton.setAttribute('aria-label', 'create user');
  createUserButton.innerText = 'Create User';
  createUserButton.id = 'createUserButton';
  createUserButton.addEventListener('click', onCreateUserClick);
  createUserWrapper.appendChild(createUserButton);
  return createUserWrapper;
}

function adminCreateUserTitle() {
  const span = document.createElement('span');
  span.textContent = 'Create User';

  const div = document.createElement('div');
  div.classList.add('create-user-title');
  div.appendChild(span);

  return div;
}

function createErrorMessage() {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'create-user-err-msg none';
  errorDiv.textContent = 'Something Went Wrong';
  return errorDiv;
}

function openCreateUserModal() {
  const initialAuthorization = document.querySelector('.modal-container');
  initialAuthorization.classList.remove('none');
  document.body.style.overflow = 'hidden';
}

function createOpenModalButton(text) {
  const buttonWrapper = document.createElement('div');
  buttonWrapper.className = 'modal-button-wrapper';
  const button = document.createElement('button');
  button.textContent = text;
  button.addEventListener('click', openCreateUserModal);
  buttonWrapper.append(button);
  return buttonWrapper;
}

function removeData() {
  const email = document.querySelector('input[name="email"]');
  const username = document.querySelector('input[name="username"]');
  const password = document.querySelector('input[name="password"]');

  if (username && email && password) {
    username.value = '';
    email.value = '';
    password.value = '';
  }
  const messageDiv = document.querySelector('.create-user-pass-message');
  messageDiv.innerHTML = '';
  messageDiv.classList.add('none');
  const errorMessage = document.querySelector('.create-user-err-msg');
  errorMessage.innerText = 'Something Went Wrong';
  errorMessage.classList.add('none');
}

function closeModal() {
  const initialAuthorization = document.querySelector('.modal-container');
  initialAuthorization.classList.add('none');
  document.body.style.overflow = '';
  removeData();
}

function createCloseButton() {
  const closeButton = document.createElement('div');
  const spanElement = document.createElement('span');
  spanElement.addEventListener('click', closeModal);
  spanElement.innerText = 'x';
  closeButton.className = 'close-button';
  closeButton.appendChild(spanElement);
  return closeButton;
}

export default async function decorate(block) {
  const modalContainer = document.createElement('div');
  modalContainer.className = 'modal-container none';
  const modalWrapper = document.createElement('div');
  modalWrapper.className = 'modal-wrapper';
  const div = document.createElement('div');
  const closeButton = createCloseButton();

  const modalCover = document.createElement('div');
  modalCover.className = 'modal-cover';
  modalCover.addEventListener('click', closeModal);
  const modal = document.createElement('div');
  modal.className = 'modal';
  const form = document.createElement('div');
  form.className = 'form';

  const usernameInput = createUsernameInput();
  const emailAddressInput = createEmailAddressInput();
  const passwordInput = createPasswordInput();
  const passwordValidationMessage = createPasswordValidationMessage();
  const createUserButton = adminCreateUserButton();

  form.append(
    usernameInput,
    emailAddressInput,
    passwordInput,
    passwordValidationMessage,
  );
  modal.append(form, createUserButton);

  const signInTitle = adminCreateUserTitle();
  const errorMessage = createErrorMessage();

  const buttonText = `${block.cloneNode(true).textContent}`;

  const openModalButton = createOpenModalButton(buttonText);

  div.append(signInTitle, errorMessage, modal);
  modalWrapper.append(closeButton, div);
  modalContainer.append(modalWrapper, modalCover);

  block.textContent = '';
  block.append(openModalButton, modalContainer);
}

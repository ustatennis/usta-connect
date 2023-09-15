import { confirmForgotPassword } from '../../middleware/forgotPassword.js';
import { getQueryParams, redirectTo } from '../../scripts/helpers.js';
import { createOptimizedPicture } from '../../scripts/lib-franklin.js';
import {
  getPasswordValidationMessage,
  validatePasswordInput,
} from '../../validations/auth.js';
import { falseSign, forgotPasswordMessages } from '../../validations/rules.js';

function createDescription() {
  const divElement = document.createElement('div');
  divElement.className = 'confirm-f-p-description';
  const spanElement1 = document.createElement('span');
  spanElement1.innerText = 'We have sent a password reset code by email to  ';
  const spanElement2 = document.createElement('span');
  spanElement2.innerText = 'your email. ';
  spanElement2.id = 'confirmFPDescriptionEmail';
  const spanElement3 = document.createElement('span');
  spanElement3.innerText = ' Enter it below to reset your password.';
  divElement.append(spanElement1, spanElement2, spanElement3);
  return divElement;
}

function createCodeInput() {
  const wrapper = document.createElement('div');
  wrapper.classList.add('code-wrapper');

  const label = document.createElement('label');
  label.setAttribute('for', 'code');
  label.innerText = 'Code';

  const inputWrapper = document.createElement('div');
  inputWrapper.classList.add('code-input-wrapper');
  const input = document.createElement('input');
  input.setAttribute('type', 'password');
  input.setAttribute('name', 'code');
  input.required = true;

  inputWrapper.appendChild(input);
  label.appendChild(inputWrapper);
  wrapper.appendChild(label);

  return wrapper;
}

function createPasswordValidationMessage() {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'confirm-forgot-password-message none';
  return messageDiv;
}

function validatePassword() {
  const newPassword = document.querySelector('input[name="newPassword"]');
  const newPasswordRepeat = document.querySelector(
    'input[name="newPasswordRepeat"]',
  );
  const errorMessageKeys = validatePasswordInput(
    newPassword.value,
    newPasswordRepeat.value,
  );
  const errorMessages = getPasswordValidationMessage(
    errorMessageKeys,
    forgotPasswordMessages,
  );
  const messageDiv = document.querySelector('.confirm-forgot-password-message');
  messageDiv.classList.remove('none');
  messageDiv.innerHTML = '';
  errorMessages.forEach(msg => {
    const span = document.createElement('span');
    if (msg.includes(falseSign)) {
      span.classList.add('error');
    } else span.classList.remove('error');
    span.textContent = msg;
    messageDiv.appendChild(span);
  });
}

function createNewPasswordInput() {
  const label = document.createElement('label');
  label.setAttribute('for', 'newPassword');
  label.textContent = 'New password';

  const inputDiv = document.createElement('div');
  inputDiv.classList.add('new-password-input-wrapper');

  const input = document.createElement('input');
  input.setAttribute('name', 'newPassword');
  input.setAttribute('type', 'password');
  input.required = true;
  input.addEventListener('input', validatePassword);

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('new-password-wrapper');

  inputDiv.appendChild(input);
  label.appendChild(inputDiv);
  containerDiv.appendChild(label);

  return containerDiv;
}

function createNewPasswordRepeatInput() {
  const label = document.createElement('label');
  label.setAttribute('for', 'newPasswordRepeat');
  label.textContent = 'Enter New Password Again';

  const div = document.createElement('div');
  div.classList.add('new-password-repeat-input-wrapper');

  const input = document.createElement('input');
  input.setAttribute('type', 'password');
  input.setAttribute('name', 'newPasswordRepeat');
  input.required = true;
  input.addEventListener('input', validatePassword);

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('new-password-repeat-wrapper');

  div.appendChild(input);
  label.appendChild(div);
  containerDiv.appendChild(label);

  return containerDiv;
}

async function onConfirmResetButtonClick() {
  const code = document.querySelector('input[name="code"]');
  const newPassword = document.querySelector('input[name="newPassword"]');
  const newPasswordRepeat = document.querySelector(
    'input[name="newPasswordRepeat"]',
  );

  if (!code.reportValidity()) return;
  if (!newPassword.reportValidity()) return;
  if (!newPasswordRepeat.reportValidity()) return;

  const confirmResetPasswordButton = document.querySelector(
    '#confirmResetPasswordButton',
  );
  confirmResetPasswordButton.disabled = true;
  confirmResetPasswordButton.innerText = '';
  confirmResetPasswordButton.classList.add('loading');

  const data = {
    code: code.value,
    newPassword: newPassword.value,
  };

  try {
    await confirmForgotPassword(data);
    const query = getQueryParams();
    redirectTo('/sign-in', query);
  } catch (err) {
    const errorMessage = document.querySelector('.confirm-forgot-pass-err-msg');
    errorMessage.style.display = 'block';
    if (err?.message) errorMessage.innerText = err.message;
  } finally {
    confirmResetPasswordButton.disabled = false;
    confirmResetPasswordButton.innerText = 'Change Password';
    confirmResetPasswordButton.classList.remove('loading');
  }
}

function createConfirmFPButton() {
  const divElement = document.createElement('div');
  divElement.className = 'confirm-r-f-button-wrapper';
  const buttonElement = document.createElement('button');
  buttonElement.setAttribute('type', 'submit');
  buttonElement.setAttribute('aria-label', 'confirm reset password');
  buttonElement.innerText = 'Change Password';
  buttonElement.id = 'confirmResetPasswordButton';
  buttonElement.addEventListener('click', onConfirmResetButtonClick);
  divElement.appendChild(buttonElement);
  return divElement;
}

function createErrorMessage() {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'confirm-forgot-pass-err-msg';
  errorDiv.textContent = 'Something Went Wrong';
  return errorDiv;
}

function setInitialStyle() {
  const initialAuthorization = document.querySelector(
    '.confirm-forgot-password-container',
  );
  initialAuthorization.classList.add('none');
}

export default function decorate(block) {
  setInitialStyle();

  const modalCover = document.createElement('div');
  modalCover.className = 'modal-cover';
  const modal = document.createElement('div');
  modal.className = 'modal';
  const form = document.createElement('div');
  form.className = 'form';

  const codeInput = createCodeInput();
  const newPasswordInput = createNewPasswordInput();
  const newPasswordRepeatInput = createNewPasswordRepeatInput();
  const confirmFPButton = createConfirmFPButton();
  const passwordValidationMessage = createPasswordValidationMessage();

  form.append(
    codeInput,
    newPasswordInput,
    newPasswordRepeatInput,
    passwordValidationMessage,
    confirmFPButton,
  );
  modal.append(form);

  const logoWrapper = block.children[0].cloneNode(true);
  logoWrapper.className = 'logo-wrapper';
  logoWrapper
    .querySelectorAll('img')
    .forEach(img =>
      img
        .closest('picture')
        .replaceWith(
          createOptimizedPicture(img.src, img.alt, false, [
            { width: 100, height: 70 },
          ]),
        ),
    );

  const description = createDescription();
  const errorMessage = createErrorMessage();

  block.textContent = '';
  block.append(logoWrapper, description, errorMessage, modal, modalCover);
}

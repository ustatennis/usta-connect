import { createOptimizedPicture } from '../../scripts/lib-franklin.js';
import { forgotPassword } from '../../middleware/forgotPassword.js';
import { getFPCodeData } from '../../store/forgotPasswordStore.js';

function createTitle() {
  const divElement = document.createElement('div');
  divElement.classList.add('title');
  const spanElement = document.createElement('span');
  spanElement.innerText = 'Forgot your password?';
  divElement.appendChild(spanElement);
  return divElement;
}

function createDescription() {
  const divElement = document.createElement('div');
  divElement.className = 'description';
  const spanElement = document.createElement('span');
  spanElement.innerText =
    'Enter your Email below and we will send a message to reset your password';
  divElement.appendChild(spanElement);
  return divElement;
}

function createUsernameInput() {
  const divElement = document.createElement('div');
  divElement.className = 'username-wrapper';
  const inputElement = document.createElement('input');
  inputElement.setAttribute('type', 'text');
  inputElement.setAttribute('name', 'email');
  inputElement.setAttribute('placeholder', 'Email');
  inputElement.required = true;

  divElement.appendChild(inputElement);
  return divElement;
}

function openConfirmForgotPasswordModal() {
  const forgotPasswordForm = document.querySelector(
    '.forgot-password-container',
  );
  const confirmForgotPasswordForm = document.querySelector(
    '.confirm-forgot-password-container',
  );
  confirmForgotPasswordForm.classList.remove('none');
  forgotPasswordForm.classList.add('none');

  const hashedEmail = getFPCodeData()?.CodeDeliveryDetails?.Destination;

  const confirmFPDescriptionEmailSpan = document.querySelector(
    '#confirmFPDescriptionEmail',
  );
  confirmFPDescriptionEmailSpan.innerHTML = `${hashedEmail}.`;
}

async function onResetButtonClick() {
  const username = document.querySelector('input[name="email"]');

  if (!username.reportValidity()) return;

  const resetPasswordButton = document.querySelector('#resetPasswordButton');
  resetPasswordButton.disabled = true;
  resetPasswordButton.innerText = '';
  resetPasswordButton.classList.add('loading');

  const data = {
    username: username.value,
  };

  try {
    await forgotPassword(data);
    openConfirmForgotPasswordModal();
  } catch (err) {
    const errorMessage = document.querySelector('.forgot-pass-err-msg');
    errorMessage.style.display = 'block';
    if (err?.message) errorMessage.innerText = err.message;
  } finally {
    resetPasswordButton.disabled = false;
    resetPasswordButton.innerText = 'Reset my password';
    resetPasswordButton.classList.remove('loading');
  }
}

function createResetButton() {
  const divElement = document.createElement('div');
  divElement.className = 'reset-button-wrapper';
  const buttonElement = document.createElement('button');
  buttonElement.setAttribute('type', 'submit');
  buttonElement.setAttribute('aria-label', 'reset my password');
  buttonElement.innerText = 'Reset my password';
  buttonElement.id = 'resetPasswordButton';
  buttonElement.addEventListener('click', onResetButtonClick);
  divElement.appendChild(buttonElement);
  return divElement;
}

function createErrorMessage() {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'forgot-pass-err-msg';
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

  const title = createTitle();
  const description = createDescription();
  const usernameInput = createUsernameInput();
  const resetButton = createResetButton();

  form.append(usernameInput, resetButton);
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

  const errorMessage = createErrorMessage();

  block.textContent = '';
  block.append(
    logoWrapper,
    title,
    description,
    errorMessage,
    modal,
    modalCover,
  );
}

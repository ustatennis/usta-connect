import { createOptimizedPicture } from '../../scripts/lib-franklin.js';
import { getQueryParams, redirectTo } from '../../scripts/helpers.js';
import { confirmSignUp } from '../../middleware/signUp.js';

function createDescription() {
  const divElement = document.createElement('div');
  divElement.className = 'verify-sign-up-description';
  const spanElement1 = document.createElement('span');
  spanElement1.innerText = 'We have sent a password reset code by email to  ';
  const spanElement2 = document.createElement('span');
  spanElement2.innerText = 'your email. ';
  spanElement2.id = 'verifySignUpDescriptionEmail';
  const spanElement3 = document.createElement('span');
  spanElement3.innerText = ' Enter it below to confirm your account.';
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

async function onSendCodeButtonClick() {
  const code = document.querySelector('input[name="code"]');

  if (!code.reportValidity()) return;

  const sendVerifyCodeButton = document.querySelector('#sendVerifyCodeButton');
  sendVerifyCodeButton.disabled = true;
  sendVerifyCodeButton.innerText = '';
  sendVerifyCodeButton.classList.add('loading');

  try {
    await confirmSignUp(code.value);
    const query = getQueryParams();
    redirectTo(query?.redirect_url || '/');
  } catch (err) {
    const errorMessage = document.querySelector('.verify-sign-up-err-msg');
    errorMessage.style.display = 'block';
    if (err?.message) errorMessage.innerText = err.message;
  } finally {
    sendVerifyCodeButton.disabled = false;
    sendVerifyCodeButton.innerText = 'Send';
    sendVerifyCodeButton.classList.remove('loading');
  }
}

function createSendCodeButton() {
  const divElement = document.createElement('div');
  divElement.className = 'send-code-button-wrapper';
  const buttonElement = document.createElement('button');
  buttonElement.setAttribute('type', 'submit');
  buttonElement.setAttribute('aria-label', 'send code');
  buttonElement.innerText = 'Send';
  buttonElement.id = 'sendVerifyCodeButton';
  buttonElement.addEventListener('click', onSendCodeButtonClick);
  divElement.appendChild(buttonElement);
  return divElement;
}

function createErrorMessage() {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'verify-sign-up-err-msg';
  errorDiv.textContent = 'Something Went Wrong';
  return errorDiv;
}

function setInitialStyle() {
  const initialAuthorization = document.querySelector(
    '.verify-sign-up-container',
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
  const sendButton = createSendCodeButton();

  form.append(codeInput, sendButton);
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

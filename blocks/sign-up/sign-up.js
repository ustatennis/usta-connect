import { createOptimizedPicture } from '../../scripts/lib-franklin.js';
import { signUp } from '../../middleware/signUp.js';
import { getSignUpCodeData } from '../../store/signUpStore.js';
import {
  getPasswordValidationMessage,
  validatePasswordInput,
} from '../../validations/auth.js';
import { falseSign, signUpPasswordMessages } from '../../validations/rules.js';
import { buildUrl, getQueryParams } from '../../scripts/helpers.js';

function createSignUpTitle() {
  const span = document.createElement('span');
  span.textContent = 'Sign up with a new account';

  const div = document.createElement('div');
  div.classList.add('sign-up-title');
  div.appendChild(span);

  return div;
}

function createUsernameInput() {
  const wrapper = document.createElement('div');
  wrapper.classList.add('username-wrapper');

  const label = document.createElement('label');
  label.setAttribute('for', 'email');
  label.innerText = 'Email';

  const inputWrapper = document.createElement('div');
  inputWrapper.classList.add('username-input-wrapper');
  const input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.setAttribute('name', 'email');
  input.required = true;

  inputWrapper.appendChild(input);
  label.appendChild(inputWrapper);
  wrapper.appendChild(label);

  return wrapper;
}

function createNameInput() {
  const wrapper = document.createElement('div');
  wrapper.classList.add('name-wrapper');

  const label = document.createElement('label');
  label.setAttribute('for', 'name');
  label.innerText = 'Name';

  const inputWrapper = document.createElement('div');
  inputWrapper.classList.add('name-input-wrapper');
  const input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.setAttribute('name', 'name');
  input.required = true;

  inputWrapper.appendChild(input);
  label.appendChild(inputWrapper);
  wrapper.appendChild(label);

  return wrapper;
}

function createPhoneNumberInput() {
  const outerDiv = document.createElement('div');
  outerDiv.className = 'phone-number-wrapper';

  const label = document.createElement('label');
  label.setAttribute('for', 'phoneNumber');
  label.innerText = 'Phone number';

  const innerDiv = document.createElement('div');
  innerDiv.className = 'phone-number-input-wrapper';

  const input = document.createElement('input');
  input.setAttribute('type', 'tel');
  input.setAttribute('name', 'phoneNumber');
  input.setAttribute('placeholder', '+123456789');
  input.required = true;

  innerDiv.appendChild(input);
  label.appendChild(innerDiv);
  outerDiv.appendChild(label);

  return outerDiv;
}

function createCountryInput() {
  const wrapper = document.createElement('div');
  wrapper.classList.add('country-wrapper');

  const label = document.createElement('label');
  label.setAttribute('for', 'country');
  label.innerText = 'Country';

  const inputWrapper = document.createElement('div');
  inputWrapper.classList.add('country-input-wrapper');
  const input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.setAttribute('name', 'country');
  input.required = true;

  inputWrapper.appendChild(input);
  label.appendChild(inputWrapper);
  wrapper.appendChild(label);

  return wrapper;
}

function createAffiliationInput() {
  const wrapper = document.createElement('div');
  wrapper.classList.add('affiliation-wrapper');

  const label = document.createElement('label');
  label.setAttribute('for', 'affiliation');
  label.innerText = 'Affiliation';

  const inputWrapper = document.createElement('div');
  inputWrapper.classList.add('affiliation-input-wrapper');
  const input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.setAttribute('name', 'affiliation');
  input.required = true;

  inputWrapper.appendChild(input);
  label.appendChild(inputWrapper);
  wrapper.appendChild(label);

  return wrapper;
}

function createPasswordValidationMessage() {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'sign-up-password-message none';
  return messageDiv;
}

function validatePassword(e) {
  const value = e?.target?.value;
  const errorMessageKeys = validatePasswordInput(value);
  const errorMessages = getPasswordValidationMessage(
    errorMessageKeys,
    signUpPasswordMessages,
  );
  const messageDiv = document.querySelector('.sign-up-password-message');
  messageDiv.innerHTML = '';
  messageDiv.classList.remove('none');
  errorMessages.forEach(msg => {
    const span = document.createElement('span');
    if (msg.includes(falseSign)) {
      span.classList.add('error');
    } else span.classList.remove('error');
    span.textContent = msg;
    messageDiv.appendChild(span);
  });
}

function createPasswordInput() {
  const label = document.createElement('label');
  label.setAttribute('for', 'password');
  label.textContent = 'Password';

  const inputDiv = document.createElement('div');
  inputDiv.classList.add('password-input-wrapper');

  const input = document.createElement('input');
  input.setAttribute('name', 'password');
  input.setAttribute('type', 'password');
  input.required = true;

  input.addEventListener('input', validatePassword);

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('password-wrapper');

  inputDiv.appendChild(input);
  label.appendChild(inputDiv);
  containerDiv.appendChild(label);

  return containerDiv;
}

function openVerifySignUpModal() {
  const signUpModal = document.querySelector('.sign-up-container');
  const verifySignUpModal = document.querySelector('.verify-sign-up-container');
  signUpModal.classList.add('none');
  verifySignUpModal.classList.remove('none');

  const hashedEmail = getSignUpCodeData()?.CodeDeliveryDetails?.Destination;

  const verifySignUpEmailSpan = document.querySelector(
    '#verifySignUpDescriptionEmail',
  );
  verifySignUpEmailSpan.innerHTML = `${hashedEmail}.`;
}

async function onSignUpClick() {
  const username = document.querySelector('input[name="email"]');
  const password = document.querySelector('input[name="password"]');
  const name = document.querySelector('input[name="name"]');
  const phoneNumber = document.querySelector('input[name="phoneNumber"]');
  const affiliation = document.querySelector('input[name="affiliation"]');
  const country = document.querySelector('input[name="country"]');

  if (!username.reportValidity()) return;
  if (!password.reportValidity()) return;
  if (!name.reportValidity()) return;
  if (!phoneNumber.reportValidity()) return;
  if (!affiliation.reportValidity()) return;
  if (!country.reportValidity()) return;

  const formData = {
    password: password.value,
    username: username.value,
    name: name.value,
    phoneNumber: phoneNumber.value,
    country: country.value,
    affiliation: affiliation.value,
  };

  const signUpButton = document.querySelector('#signUpButton');
  signUpButton.disabled = true;
  signUpButton.innerText = '';
  signUpButton.classList.add('loading');

  try {
    await signUp(formData);
    openVerifySignUpModal();
  } catch (err) {
    const errorMessage = document.querySelector('.sign-up-err-msg');
    errorMessage.style.display = 'block';
    if (err?.message) errorMessage.innerText = err.message;
  } finally {
    signUpButton.disabled = false;
    signUpButton.classList.remove('loading');
    signUpButton.innerText = 'Sign up';
  }
}

function createSignUpButton() {
  const signUpWrapper = document.createElement('div');
  signUpWrapper.classList.add('sign-up-button-wrapper');
  const signUpButton = document.createElement('button');
  signUpButton.setAttribute('type', 'submit');
  signUpButton.setAttribute('aria-label', 'sign-up');
  signUpButton.innerText = 'Sign Up';
  signUpButton.id = 'signUpButton';
  signUpButton.addEventListener('click', onSignUpClick);
  signUpWrapper.appendChild(signUpButton);
  return signUpWrapper;
}

function createSignInLink() {
  const span = document.createElement('span');
  span.textContent = 'Already have an account?';

  const link = document.createElement('a');
  const query = getQueryParams();
  link.href = buildUrl('/sign-in', query);
  link.textContent = 'Sign In';

  const div = document.createElement('div');
  div.classList.add('sign-in-link');
  div.appendChild(span);
  div.appendChild(link);

  return div;
}

function createErrorMessage() {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'sign-up-err-msg';
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
  const nameInput = createNameInput();
  const phoneNumberInput = createPhoneNumberInput();
  const countryInput = createCountryInput();
  const affiliationInput = createAffiliationInput();
  const passwordInput = createPasswordInput();
  const signUpButton = createSignUpButton();
  const signInLink = createSignInLink();
  const passwordValidationMessage = createPasswordValidationMessage();

  form.append(
    usernameInput,
    nameInput,
    phoneNumberInput,
    countryInput,
    affiliationInput,
    passwordInput,
    passwordValidationMessage,
    signUpButton,
  );
  modal.append(form, signInLink);

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

  const signUpTitle = createSignUpTitle();
  const errorMessage = createErrorMessage();

  block.textContent = '';
  block.append(logoWrapper, signUpTitle, errorMessage, modal, modalCover);
}

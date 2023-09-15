import { createOptimizedPicture } from '../../scripts/lib-franklin.js';
import { getQueryParams, redirectTo } from '../../scripts/helpers.js';

import {
  getVerifyCodeData,
  removeSignInSessionData,
} from '../../store/authStore.js';
import { respondToAuthChallenge } from '../../middleware/auth.js';
import {
  getEmailVerificationCode,
  updateUserInitialAttributes,
} from '../../middleware/user.js';
import { getUser } from '../../store/userStore.js';
import {
  getPasswordValidationMessage,
  validatePasswordInput,
} from '../../validations/auth.js';
import {
  falseSign,
  initialSignInPasswordMessages,
} from '../../validations/rules.js';

function createChangePasswordAbout() {
  const titleSpan = document.createElement('span');
  titleSpan.textContent = 'Change Password';
  const descriptionSpan = document.createElement('span');
  descriptionSpan.textContent = 'Please enter your new password below.';

  const div = document.createElement('div');
  div.classList.add('change-password-about');
  const titleDiv = document.createElement('div');
  titleDiv.className = 'title-wrapper';
  const descriptionDiv = document.createElement('div');
  descriptionDiv.className = 'description-wrapper';

  titleDiv.append(titleSpan);
  descriptionDiv.append(descriptionSpan);

  div.appendChild(titleDiv, descriptionDiv);

  return div;
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
  messageDiv.className = 'initial-auth-password-message none';
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
    initialSignInPasswordMessages,
  );
  const messageDiv = document.querySelector('.initial-auth-password-message');
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

  input.addEventListener('input', validatePassword);
  input.required = true;

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

  input.addEventListener('input', validatePassword);

  input.required = true;

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('new-password-repeat-wrapper');

  div.appendChild(input);
  label.appendChild(div);
  containerDiv.appendChild(label);

  return containerDiv;
}

function openVerifyInitialAuthModal() {
  const initialAuthorization = document.querySelector(
    '.initial-auth-container',
  );
  const verifyInitialAuthorization = document.querySelector(
    '.verify-initial-auth-container',
  );
  initialAuthorization.classList.add('none');
  verifyInitialAuthorization.classList.remove('none');

  const hashedEmail = getVerifyCodeData()?.CodeDeliveryDetails?.Destination;

  const verifyInitialAuthDescriptionEmailSpan = document.querySelector(
    '#verifyInitialAuthDescriptionEmail',
  );
  verifyInitialAuthDescriptionEmailSpan.innerHTML = `${hashedEmail}.`;
}

async function onSendClick() {
  const newPassword = document.querySelector('input[name="newPassword"]');
  const newPasswordRepeat = document.querySelector(
    'input[name="newPasswordRepeat"]',
  );
  const name = document.querySelector('input[name="name"]');
  const phoneNumber = document.querySelector('input[name="phoneNumber"]');
  const affiliation = document.querySelector('input[name="affiliation"]');
  const country = document.querySelector('input[name="country"]');

  if (!newPassword.reportValidity()) return;
  if (!newPasswordRepeat.reportValidity()) return;
  if (!name.reportValidity()) return;
  if (!phoneNumber.reportValidity()) return;
  if (!affiliation.reportValidity()) return;
  if (!country.reportValidity()) return;

  const formData = {
    newPassword: newPassword.value,
    newPasswordRepeat: newPasswordRepeat.value,
    name: name.value,
    phoneNumber: phoneNumber.value,
    country: country.value,
    affiliation: affiliation.value,
  };

  const sendButton = document.querySelector('#sendButton');
  sendButton.disabled = true;
  sendButton.innerText = '';
  sendButton.classList.add('loading');

  try {
    await respondToAuthChallenge(formData);
    if (formData?.affiliation || formData?.country) {
      await updateUserInitialAttributes(formData.affiliation, formData.country);
    }
    const user = getUser();
    const isVerified =
      user?.UserAttributes?.find(attr => attr.Name === 'email_verified')
        ?.Value === 'true';
    if (!isVerified) {
      await getEmailVerificationCode();
      openVerifyInitialAuthModal();
    } else {
      removeSignInSessionData();
      const query = getQueryParams();
      redirectTo(query?.redirect_url || '/');
    }
  } catch (err) {
    const errorMessage = document.querySelector('.init-auth-err-msg');
    errorMessage.style.display = 'block';
    if (err?.message) errorMessage.innerText = err.message;
  } finally {
    sendButton.disabled = false;
    sendButton.classList.remove('loading');
    sendButton.innerText = 'Send';
  }
}

function createSendButton() {
  const buttonDiv = document.createElement('div');
  buttonDiv.classList.add('send-button-wrapper');

  const sendButton = document.createElement('button');
  sendButton.setAttribute('aria-label', 'send change password');
  sendButton.id = 'sendButton';
  sendButton.innerText = 'Send';
  sendButton.addEventListener('click', onSendClick);
  buttonDiv.appendChild(sendButton);

  return buttonDiv;
}

function createErrorMessage() {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'init-auth-err-msg';
  errorDiv.textContent = 'Something Went Wrong';
  return errorDiv;
}

function setInitialStyle() {
  const initialAuthorization = document.querySelector(
    '.initial-auth-container',
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

  const newPasswordInput = createNewPasswordInput();
  const newPasswordRepeatInput = createNewPasswordRepeatInput();
  const nameInput = createNameInput();
  const phoneNumberInput = createPhoneNumberInput();
  const countryInput = createCountryInput();
  const affiliationInput = createAffiliationInput();
  const sendButton = createSendButton();
  const passwordValidationMessage = createPasswordValidationMessage();

  form.append(
    newPasswordInput,
    newPasswordRepeatInput,
    passwordValidationMessage,
    nameInput,
    phoneNumberInput,
    countryInput,
    affiliationInput,
    sendButton,
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
          createOptimizedPicture(img.src, img.alt, true, [
            { width: 100, height: 70 },
          ]),
        ),
    );

  const changePasswordAbout = createChangePasswordAbout();
  const errorMessage = createErrorMessage();

  block.textContent = '';
  block.append(
    logoWrapper,
    changePasswordAbout,
    errorMessage,
    modal,
    modalCover,
  );
}

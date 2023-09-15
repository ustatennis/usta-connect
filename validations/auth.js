import { falseSign, passwordRuleMessages, trueSign } from './rules.js';

export function validatePasswordInput(input, repeat) {
  const errors = [];

  // Rule 1: At least one lowercase letter
  if (!/[a-z]/.test(input)) {
    errors.push(1);
  }

  // Rule 2: At least one uppercase letter
  if (!/[A-Z]/.test(input)) {
    errors.push(2);
  }

  // Rule 3: At least one digit
  if (!/\d/.test(input)) {
    errors.push(3);
  }

  // Rule 4: At least 8 characters long
  if (input.length < 8) {
    errors.push(4);
  }

  // Rule 5: At least one special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(input)) {
    errors.push(5);
  }

  // Rule 6: Must not contain a leading or trailing space
  if (!/^\S.*\S$/.test(input)) {
    errors.push(6);
  }

  // Rule 7: Must match
  if (repeat !== undefined) {
    if (input !== repeat || (repeat === '' && input === '')) {
      errors.push(7);
    }
  }

  return errors;
}

export function getPasswordValidationMessage(errorMessages, allMessages) {
  const messages = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const messageKey of allMessages) {
    if (errorMessages.includes(messageKey)) {
      messages.push(`${falseSign} ${passwordRuleMessages[messageKey]}`);
    } else {
      messages.push(`${trueSign} ${passwordRuleMessages[messageKey]}`);
    }
  }

  return messages;
}

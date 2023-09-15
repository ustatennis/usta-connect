import { signUpApi } from '../api/signUpApi.js';
import { getAWSStore } from '../store/awsStore.js';
import {
  getSignUpFormData,
  removeSignUpCodeData,
  removeSignUpFormData,
  setSignUpCodeData,
  setSignUpFormData,
} from '../store/signUpStore.js';
import { logIn } from './auth.js';

export async function signUp(formData) {
  const UserAttributes = [
    {
      Name: 'phone_number',
      Value: formData.phoneNumber,
    },
    {
      Name: 'name',
      Value: formData.name,
    },
  ];
  if (formData.affiliation) {
    UserAttributes.push({
      Name: 'custom:affiliation',
      Value: formData.affiliation,
    });
  }
  if (formData.country) {
    UserAttributes.push({
      Name: 'custom:country',
      Value: formData.country,
    });
  }
  const { clientId } = getAWSStore();
  const reqData = {
    ClientId: clientId,
    Password: formData.password,
    UserAttributes,
    Username: formData.username,
  };
  try {
    const res = await signUpApi.signUp(reqData);
    setSignUpFormData(formData);
    setSignUpCodeData(res);
    return res;
  } catch (err) {
    throw new Error(err);
  }
}

export async function confirmSignUp(code) {
  const formData = getSignUpFormData();
  const { clientId } = getAWSStore();
  const reqData = {
    ClientId: clientId,
    ConfirmationCode: code,
    ForceAliasCreation: true,
    Username: formData.username,
  };
  try {
    const res = await signUpApi.confirmSignUp(reqData);
    await logIn(formData?.username, formData?.password);
    removeSignUpCodeData();
    removeSignUpFormData();
    return res;
  } catch (err) {
    throw new Error(err);
  }
}

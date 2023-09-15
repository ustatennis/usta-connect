import { forgotPasswordApi } from '../api/forgotPasswordApi.js';
import { getAWSStore } from '../store/awsStore.js';
import {
  getFPFormData,
  removeFPCodeData,
  removeFPFormData,
  setFPCodeData,
  setFPFormData,
} from '../store/forgotPasswordStore.js';

export async function forgotPassword(data) {
  const { clientId } = getAWSStore();
  const reqData = {
    ClientId: clientId,
    Username: data.username,
  };
  try {
    const res = await forgotPasswordApi.forgotPassword(reqData);
    setFPFormData(data);
    setFPCodeData(res);
    return res;
  } catch (err) {
    throw new Error(err);
  }
}

export async function confirmForgotPassword(userData) {
  const { username } = getFPFormData();
  const { clientId } = getAWSStore();
  const reqData = {
    ClientId: clientId,
    Username: username,
    ConfirmationCode: userData.code,
    Password: userData.newPassword,
  };
  try {
    const res = await forgotPasswordApi.confirmForgotPassword(reqData);
    removeFPCodeData();
    removeFPFormData();
    return res;
  } catch (err) {
    throw new Error(err);
  }
}

export async function resendConfirmationCode(email) {
  const { clientId } = getAWSStore();
  const reqData = {
    ClientId: clientId,
    Username: email,
  };
  try {
    return await forgotPasswordApi.resendConfirmationCode(reqData);
  } catch (err) {
    throw new Error(err);
  }
}

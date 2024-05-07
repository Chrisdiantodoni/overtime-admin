import { Axios } from '../utils';

export const login = async (body) => {
  try {
    const response = await Axios.post(`/auth/login`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (body) => {
  try {
    const response = await Axios.patch(`/auth/passwords`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAuth = async () => {
  try {
    const response = await Axios.get(`/me`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await Axios.post(`/auth/logout`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

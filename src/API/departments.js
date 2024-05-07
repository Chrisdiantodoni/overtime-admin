import { Axios } from 'src/utils';

export const getAllDepartments = async () => {
  try {
    const response = await Axios.get(`/admin/departments`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getManagedDepartments = async () => {
  try {
    const response = await Axios.get(`/departments`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getManagedAdminDepartment = async () => {
  try {
    const response = await Axios.get(`/super-admin/departments`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

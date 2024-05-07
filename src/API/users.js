import { Axios } from 'src/utils';

export const userDetail = async (id) => {
  const params = {
    include: ['department', 'roles'],
  };
  try {
    const response = await Axios.get(`/admin/users/${id}`, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const register = async (body) => {
  try {
    const response = await Axios.post(`/admin/users`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const updateUser = async (id, body) => {
  try {
    const response = await Axios.put(`/admin/users/${id}`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

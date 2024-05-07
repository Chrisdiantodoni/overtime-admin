import { Axios } from 'src/utils';

export const getSuperAdminUser = async (departmentId, search, size, page) => {
  const params = {
    include: ['department', 'roles'],
    filter: {
      keyword: search,
    },
    page_size: size,
    page,
  };
  if (departmentId) {
    params.filter.department_id = departmentId;
  }
  try {
    const response = await Axios.get(`/super-admin/users`, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const adminDetail = async (id) => {
  const params = {
    include: ['department', 'roles'],
  };
  try {
    const response = await Axios.get(`/super-admin/users/${id}`, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resetPasswordAdmin = async (body) => {
  try {
    const response = await Axios.patch(`/super-admin/reset-password`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addNewAdmin = async (body) => {
  try {
    const response = await Axios.post(`/super-admin/users`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const updateAdmin = async (id, body) => {
  try {
    const response = await Axios.put(`/super-admin/users/${id}`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

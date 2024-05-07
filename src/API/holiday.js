import { Axios } from 'src/utils';

export const holidayList = async (name, size, page, sortBy, sortOrder) => {
  try {
    const response = await Axios.get(`/admin/holidays`, {
      params: {
        filter: {
          name,
        },
        page_size: size,
        page,
        sort_by: sortBy,
        sort_order: sortOrder,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const HolidayDetail = async (id) => {
  try {
    const response = await Axios.get(`/admin/holidays/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addNewHoliday = async (body) => {
  try {
    const response = await Axios.post(`/admin/holidays`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateHoliday = async (id, body) => {
  try {
    const response = await Axios.put(`/admin/holidays/${id}`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteHoliday = async (id) => {
  try {
    const response = await Axios.delete(`/admin/holidays/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

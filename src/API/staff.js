import { Axios } from 'src/utils';

export const getStaffGeneral = async (departmenId, search, size, page) => {
  const params = {
    include: ['department', 'staffImage'],
    filter: {
      keyword: search,
    },
    page_size: size,
    page,
  };
  if (departmenId) {
    params.filter.department_id = departmenId;
  }
  try {
    const response = await Axios.get('/admin/staffs', {
      params,
    });
    return response ? response.data : [];
  } catch (error) {
    throw error;
  }
};

export const getOwnStaff = async (departmenId, search, size, page) => {
  const params = {
    include: ['department', 'staffImage'],
    filter: {
      keyword: search,
    },
    page_size: size,
    page,
  };
  if (departmenId) {
    params.filter.department_id = departmenId;
  }
  try {
    const response = await Axios.get('/staffs', {
      params,
    });
    return response ? response.data : [];
  } catch (error) {
    throw error;
  }
};

export const getHolidayRequester = async (start, end) => {
  const params = {
    filter: {
      date_range: {
        start_at: start,
        end_at: end,
      },
    },
  };
  try {
    const response = await Axios.get('/holidays', { params });
    return response ? response.data : [];
  } catch (error) {
    throw error;
  }
};

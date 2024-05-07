import { Axios } from '../utils';
import dayjs from 'dayjs';
var utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

export const getUser = async (departmentId, search, size, page) => {
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
    const response = await Axios.get('/admin/users', {
      params,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const resetPassword = async (body) => {
  try {
    const response = await Axios.patch(`/admin/reset-password`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const overTimeStaffs = async (departmentId, start, end, search, size, page) => {
  const startDate = dayjs(start).hour(0).minute(0).second(0);
  const params = {
    include: ['department', 'overtimeRequestPayableDuration'],
    filter: {
      date_range: {
        start_at: dayjs.utc(startDate).hour(17).minute(0).second(0).format('YYYY-MM-DD[T]HH:mm:ssZ'),
        end_at: dayjs(end).isSame(dayjs(), 'day')
          ? dayjs.utc().format('YYYY-MM-DD[T]HH:mm:ssZ')
          : dayjs.utc(end).hour(16).minute(59).second(59).format('YYYY-MM-DD[T]HH:mm:ssZ'),
      },
      keyword: search,
    },
    page_size: size,
    page,
  };
  if (departmentId) {
    params.filter.department_id = departmentId;
  }
  try {
    const response = await Axios.get(`/admin/overtime-staffs`, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const exportOvertimeStaff = async (departmentId, start, end, search) => {
  const startDate = dayjs(start).hour(0).minute(0).second(0);
  const params = {
    include: ['department', 'overtimeRequestPayableDuration'],
    filter: {
      date_range: {
        start_at: dayjs.utc(startDate).hour(17).minute(0).second(0).format('YYYY-MM-DD[T]HH:mm:ssZ'),
        end_at: dayjs(end).isSame(dayjs(), 'day')
          ? dayjs.utc().format('YYYY-MM-DD[T]HH:mm:ssZ')
          : dayjs.utc(end).hour(16).minute(59).second(59).format('YYYY-MM-DD[T]HH:mm:ssZ'),
      },
      keyword: search,
    },
  };
  if (departmentId) {
    params.filter.department_id = departmentId;
  }
  try {
    const response = await Axios.get(`/admin/overtime-staffs/export`, { params, responseType: 'blob' });
    return response;
  } catch (error) {
    throw error;
  }
};
export const overtimeRequestAdmin = async (start, end, search, size, page, status, staffId, departmentId, sort) => {
  const startDate = dayjs(start).hour(0).minute(0).second(0);
  const params = {
    include: ['requesterUser', 'overtimeStaffs'],
    sort: [sort],
    filter: {
      date_range: {
        start_at: dayjs.utc(startDate).format('YYYY-MM-DD[T]HH:mm:ssZ'),
        end_at: dayjs(end).isSame(dayjs(), 'day')
          ? dayjs.utc().format('YYYY-MM-DD[T]HH:mm:ssZ')
          : dayjs.utc(end).hour(16).minute(59).second(59).format('YYYY-MM-DD[T]HH:mm:ssZ'),
      },
    },
    page_size: size,
    page,
  };

  if (search) {
    params.filter.code = search;
  }
  if (staffId) {
    params.filter.staff_id = staffId;
  }
  if (departmentId) {
    params.filter.department_id = departmentId;
  }
  if (status) {
    params.filter.status = status;
  }

  try {
    const response = await Axios.get(`/admin/overtime-requests`, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const overtimeRequestAdminDetail = async (
  id,
  includeOvertimeRequestVoidReason,
  includeOvertimeRequestRejectedReason
) => {
  const params = {
    include: ['requesterUser', 'staffs.staffImage'],
  };
  if (includeOvertimeRequestVoidReason) {
    params.include.push('overtimeRequestVoidReason');
  }
  if (includeOvertimeRequestRejectedReason) {
    params.include.push('overtimeRequestRejectedReason');
  }
  try {
    const response = await Axios.get(`/admin/overtime-requests/${id}`, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const voidOvertimeRequests = async (id, body) => {
  try {
    const response = await Axios.put(`/admin/overtime-requests/${id}/void`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const uploadStaffImage = async (body) => {
  try {
    const response = await Axios.post(`/admin/staff-images`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getStaffImagesAdmin = async (id, body) => {
  try {
    const response = await Axios.post(`/admin/staff-images/${id}`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteStaffImageAdmin = async (id) => {
  try {
    const response = await Axios.delete(`/admin/staff-images/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getStaff = async (departmentId, search, size, page) => {
  const params = {
    include: ['department', 'staffImage'],
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
    const response = await Axios.get('/admin/staffs', {
      params,
    });
    return response ? response.data : [];
  } catch (error) {
    throw error;
  }
};

export const staffDetail = async (id) => {
  const params = {
    include: ['department', 'staffImage'],
  };
  try {
    const response = await Axios.get(`/admin/staffs/${id}`, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addNewStaff = async (body) => {
  try {
    const response = await Axios.post(`/admin/staffs`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const editStaff = async (id, body) => {
  try {
    const response = await Axios.put(`/admin/staffs/${id}`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const deleteStaff = async (id) => {
  try {
    const response = await Axios.delete(`/admin/staffs/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

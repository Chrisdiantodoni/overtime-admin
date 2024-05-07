import { Axios } from 'src/utils';
import dayjs from 'dayjs';
var utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

export const overtimeShifts = async (body) => {
  try {
    const response = await Axios.get(`/overtime-shifts`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const overtimeRequest = async (start, end, search, size, page, status, staffId, departmentId) => {
  const startDate = dayjs(start).hour(0).minute(0).second(0);
  const params = {
    include: ['requesterUser', 'overtimeStaffs'],
    filter: {
      date_range: {
        start_at: dayjs.utc(startDate).format('YYYY-MM-DD[T]HH:mm:ssZ'),
        end_at: dayjs(end).isSame(dayjs(), 'day')
          ? dayjs.utc().format('YYYY-MM-DD[T]HH:mm:ssZ')
          : dayjs.utc(end).hour(16).minute(59).second(59).format('YYYY-MM-DD[T]HH:mm:ssZ'),
      },
      code: search,
    },
    page_size: size,
    page,
  };

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
    const response = await Axios.get(`/overtime-requests`, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const overtimeRequestDetail = async (
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
    const response = await Axios.get(`/overtime-requests/${id}`, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const submitOvertimeRequest = async (body) => {
  try {
    const response = await Axios.post(`/overtime-requests`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const approveOvertimeRequest = async (id) => {
  try {
    const response = await Axios.put(`/overtime-requests/${id}/approve`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const rejectOvertimeRequest = async (id, body) => {
  try {
    const response = await Axios.put(`/overtime-requests/${id}/reject`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// // src/services/LeaveServices.js


import axios from 'axios';

const API_BASE_URL = 'http://13.233.43.240:8082'; // Adjust the base URL as per your backend configuration

const getInstituteCode = () => {
  return localStorage.getItem('institutecode');
};

export const createLeaveRequest = (leaveRequest) => {
  return axios.post(`${API_BASE_URL}/saveRequest`, leaveRequest);
};

export const getAllLeaveRequests = () => {
  const institutecode = getInstituteCode();
  return axios.get(`${API_BASE_URL}/getNonDeletedLeaves?institutecode=${institutecode}`);
};

export const getLeaveRequestById = (id) => {
  return axios.get(`${API_BASE_URL}/getLeaveRequestById/${id}`);
};

export const getLeaveRequestsByReasonDescriptionAndEmployeeId = (reasonDescription, employeeId) => {
  return axios.get(`${API_BASE_URL}/getLeaveRequestsByReasonDescriptionAndEmployeeId`, {
    params: {
      reasondescription: reasonDescription,
      empID: employeeId
    }
  });
};

export const deleteLeaveRequest = (id) => {
  return axios.delete(`${API_BASE_URL}/softDeleteLeaveById/${id}`);
};

export const updateLeaveRequestStatus = (id, leaveRequest) => {
  return axios.put(`${API_BASE_URL}/updateLeaveRequest/${id}`, leaveRequest);
};

export const last7DaysLeaves = () => {
  const institutecode = getInstituteCode();
  return axios.get(`${API_BASE_URL}/leaveRequests/last7days?institutecode=${institutecode}`);
};

export const last30DaysLeaves = () => {
  const institutecode = getInstituteCode();
  return axios.get(`${API_BASE_URL}/leaveRequests/30days?institutecode=${institutecode}`);
};

export const last365DaysLeaves = () => {
  const institutecode = getInstituteCode();
  return axios.get(`${API_BASE_URL}/leaveRequests/365days?institutecode=${institutecode}`);
};

export const rejectLeaveRequest = (id, leaveRequest) => {
  return axios.put(`${API_BASE_URL}/rejectLeaveRequest/${id}`, leaveRequest);
};

export const getLeaveRequestsByStatusAndEmpID = (status, empID) => {
  return axios.get(`${API_BASE_URL}/leaveRequestsByStatusAndempId`, {
    params: { status, empID }
  });
};

export const getLeaveRequestsByStatus = (status) => {
  const institutecode = getInstituteCode();
  return axios.get(`${API_BASE_URL}/leaveRequestsByStatus`, {
    params: { 
      status,
      institutecode: institutecode
    }
  });
};

export const getNumberOfLeaveRequestsByStatus = (status) => {
  const institutecode = getInstituteCode();
  return axios.get(`${API_BASE_URL}/NumberOfleaveRequestsByStatus`, {
    params: { 
      status,
      institutecode: institutecode
    }
  });
};

export const getAllEmployees = () => {
  const institutecode = getInstituteCode();
  return axios.get(`${API_BASE_URL}/getAllemp?institutecode=${institutecode}`);
};

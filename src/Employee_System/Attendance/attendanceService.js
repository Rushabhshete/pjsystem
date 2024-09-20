 //src/services/attendanceService.js

 import axios from 'axios';

 const API_URL = 'http://13.233.43.240:8082'; // Ensure this URL matches your backend's URL
 
 const getInstituteCode = () => {
   return localStorage.getItem('institutecode');
 };
 
 // Fetch all attendance records
 export const getAllAttendances = async () => {
   try {
     const response = await axios.get(`${API_URL}/getAllAttendence`, {
       params: { institutecode: getInstituteCode() }
     });
     return response.data;
   } catch (error) {
     console.error('Error fetching attendances:', error);
     throw error;
   }
 };
 
 // Fetch attendance records by employee ID
 export const getAttendanceById = async (empID) => {
   try {
     const response = await axios.get(`${API_URL}/getAttendenceByEmpId/${empID}`, {
       params: { institutecode: getInstituteCode() }
     });
     return response.data;
   } catch (error) {
     console.error('Error fetching attendance by ID:', error);
     throw error;
   }
 };
 
 // Fetch today's attendance records
 export const getTodaysAttendance = async () => {
   try {
     const response = await axios.get(`${API_URL}/today`, {
       params: { institutecode: getInstituteCode() }
     });
     return response.data;
   } catch (error) {
     console.error('Error fetching today\'s attendance:', error);
     throw error;
   }
 };
 
 // Fetch last 7 days attendance records by employee ID
 export const getLast7DaysAttendance = async (empID) => {
   try {
     const response = await axios.get(`${API_URL}/last7days/${empID}`);
     return response.data;
   } catch (error) {
     console.error('Error fetching last 7 days attendance:', error);
     throw error;
   }
 };
 
 // Fetch last 30 days attendance records by employee ID
 export const getLastMonthAttendance = async (empID) => {
   try {
     const response = await axios.get(`${API_URL}/last30days/${empID}`);
     return response.data;
   } catch (error) {
     console.error('Error fetching last 30 days attendance:', error);
     throw error;
   }
 };
 
 // Fetch last 365 days attendance records by employee ID
 export const getLast365DaysAttendance = async (empID) => {
   try {
     const response = await axios.get(`${API_URL}/last365days/${empID}`);
     return response.data;
   } catch (error) {
     console.error('Error fetching last 365 days attendance:', error);
     throw error;
   }
 };
 
 // Save attendance record
 export const saveAttendance = async (attendance) => {
   try {
     const response = await axios.post(`${API_URL}/LoginforSaveattendance`, attendance);
     return response.data;
   } catch (error) {
     console.error('Error saving attendance:', error);
     throw error;
   }
 };
 
 // Update attendance record (logout)
 export const updateAttendance = async (empID) => {
   try {
     const response = await axios.post(`${API_URL}/logout/${empID}`);
     return response.data;
   } catch (error) {
     console.error('Error updating attendance:', error);
     throw error;
   }
 };
 
 // Delete attendance record by employee ID
 export const deleteAttendance = async (empID) => {
   try {
     await axios.delete(`${API_URL}/deleteByEmpId/${empID}`);
   } catch (error) {
     console.error('Error deleting attendance:', error);
     throw error;
   }
 };
 
 // Delete all attendance records
 export const deleteAllAttendances = async () => {
   try {
     await axios.delete(`${API_URL}/deleteAll`);
   } catch (error) {
     console.error('Error deleting all attendances:', error);
     throw error;
   }
 };
 
 // Record break-in time for an employee
 export const recordBreakIn = async (empID) => {
   try {
     const response = await axios.post(`${API_URL}/breakIn/${empID}`);
     return response.data;
   } catch (error) {
     console.error('Error recording break-in time:', error);
     throw error;
   }
 };
 
 // Record break-out time for an employee
 export const recordBreakOut = async (empID) => {
   try {
     const response = await axios.post(`${API_URL}/breakOut/${empID}`);
     return response.data;
   } catch (error) {
     console.error('Error recording break-out time:', error);
     throw error;
   }
 };
 
 // Fetch total working days for an employee
 export const getTotalWorkingDays = async (empID) => {
   try {
     const response = await axios.get(`${API_URL}/totalWorkingDays/${empID}`);
     return response.data;
   } catch (error) {
     console.error('Error fetching total working days:', error);
     throw error;
   }
 };
 
 // Employee APIs
 
 // Fetch all employees
 export const getAllEmployees = async () => {
   try {
     const response = await axios.get(`${API_URL}/getAllemp`, {
       params: { institutecode: getInstituteCode() }
     });
     return response.data;
   } catch (error) {
     console.error('Error fetching employees:', error);
     throw error;
   }
 };
 
 // Fetch employee by ID
 export const getEmployeeById = async (empID) => {
   try {
     const response = await axios.get(`${API_URL}/${empID}`);
     return response.data;
   } catch (error) {
     console.error('Error fetching employee by ID:', error);
     throw error;
   }
 };
 
 // Add a new employee
 export const addEmployee = async (employee) => {
   try {
     const response = await axios.post(`${API_URL}/addEmp`, employee, {
       params: { institutecode: getInstituteCode() }
     });
     return response.data;
   } catch (error) {
     console.error('Error adding employee:', error);
     throw error;
   }
 };
 
 // Update an existing employee
 export const updateEmployee = async (empPutId, employee) => {
   try {
     const response = await axios.put(`${API_URL}/updateEmpByPut/${empPutId}`, employee);
     return response.data;
   } catch (error) {
     console.error('Error updating employee:', error);
     throw error;
   }
 };
 
 // Patch update an existing employee
 export const patchEmployee = async (empPatchId, updates) => {
   try {
     const response = await axios.patch(`${API_URL}/updateEmpByPatch/${empPatchId}`, updates);
     return response.data;
   } catch (error) {
     console.error('Error patch updating employee:', error);
     throw error;
   }
 };
 
 // Delete employee by ID
 export const deleteEmployee = async (empDeleteById) => {
   try {
     await axios.delete(`${API_URL}/empDeleteById/${empDeleteById}`);
   } catch (error) {
     console.error('Error deleting employee:', error);
     throw error;
   }
 };
 
 // Delete all employees
 export const deleteAllEmployees = async () => {
   try {
     await axios.delete(`${API_URL}/deleteAllEmp`);
   } catch (error) {
     console.error('Error deleting all employees:', error);
     throw error;
   }
 };
 
 // Search employee by ID
 export const searchEmployeeById = async (empSearchById) => {
   try {
     const response = await axios.get(`${API_URL}/empSearchById/${empSearchById}`);
     return response.data;
   } catch (error) {
     console.error('Error searching employee by ID:', error);
     throw error;
   }
 };
 
 // Search employee by full name
 export const searchEmployeeByFullName = async (searchByFullName) => {
   try {
     const response = await axios.get(`${API_URL}/searchByFullName/${searchByFullName}`);
     return response.data;
   } catch (error) {
     console.error('Error searching employee by full name:', error);
     throw error;
   }
 };
 
 // New APIs added in the backend
 
 // Fetch employees by status
 export const getPresentEmployees = async () => {
   try {
     const response = await axios.get(`${API_URL}/present`, {
       params: { institutecode: getInstituteCode() }
     });
     return response.data;
   } catch (error) {
     console.error('Error fetching present employees:', error);
     throw error;
   }
 };
 
 // Fetch employees by status
 export const getAbsentEmployees = async () => {
   try {
     const response = await axios.get(`${API_URL}/absent`, {
       params: { institutecode: getInstituteCode() }
     });
     return response.data;
   } catch (error) {
     console.error('Error fetching absent employees:', error);
     throw error;
   }
 };
 
 // Fetch present employee count
 export const getPresentEmployeeCount = async () => {
   try {
     const response = await axios.get(`${API_URL}/present/count`, {
       params: { institutecode: getInstituteCode() }
     });
     return response.data;
   } catch (error) {
     console.error('Error fetching present employee count:', error);
     throw error;
   }
 };
 
 
 // Fetch absent employee count
 export const getAbsentEmployeeCount = async () => {
   try {
     const response = await axios.get(`${API_URL}/absent/count`, {
       params: { institutecode: getInstituteCode() }
     });
     return response.data;
   } catch (error) {
     console.error('Error fetching absent employee count:', error);
     throw error;
   }
 };
 
 
 // Fetch attendance records by employee ID and date range
 export const getAttendanceByDateRange = async (empID, fromDate, toDate) => {
   try {
     const response = await axios.get(`${API_URL}/getAttendenceByEmpIdAndDateRange/${empID}`, {
       params: { fromDate, toDate }
     });
     return response.data;
   } catch (error) {
     console.error('Error fetching attendance by date range:', error);
     throw error;
   }
 };
 
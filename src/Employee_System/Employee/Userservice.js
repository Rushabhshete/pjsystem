import axios from 'axios';

const USER_API_URL = 'http://13.233.43.240:8082';

class UserService {
  
  // Helper method to get the institutecode from localStorage
  getInstituteCode() {
    return localStorage.getItem('institutecode');
  }

  getUser() {
    const institutecode = this.getInstituteCode();
    return axios.get(`${USER_API_URL}/getAllemp?institutecode=${institutecode}`);
  }

  getUserById(empId) {
    const institutecode = this.getInstituteCode();
    return axios.get(`${USER_API_URL}/empById/${empId}?institutecode=${institutecode}`);
  }

  getUserCSV() {
    const institutecode = this.getInstituteCode();
    return axios.get(`${USER_API_URL}/download/csv?institutecode=${institutecode}`);
  }

  addUser(formData) {
    const institutecode = this.getInstituteCode();
    console.log("Submitting formData:", formData); // Debug log
    return axios.post(`${USER_API_URL}/addEmp?institutecode=${institutecode}`, formData)
      .then(response => {
        console.log("Response received:", response);
        return response;
      })
      .catch(error => {
        console.error("Error in addUser:", error.response || error.message);
        throw error;
      });
  }


  requestPasswordReset(email) {
    return axios.post(`${USER_API_URL}/forgotpassword`, { email });
  }

  updateUser(empId, formData) {
    console.log('Updating user with id :', empId, formData); // Debug log
    return axios.put(`${USER_API_URL}/updateEmpByPut/${empId}`, formData); // Corrected URL
  }

  deleteUser(empId) {
    console.log(`Deleting user with ID: ${empId}`);
    const institutecode = this.getInstituteCode();
    return axios.delete(`${USER_API_URL}/empDeleteById/${empId}?institutecode=${institutecode}`);
  }
}

export default new UserService();

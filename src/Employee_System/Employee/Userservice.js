import axios from 'axios';

const USER_API_URL = 'http://localhost:8082';

class UserService {
  
  // Helper method to get the institutecode from localStorage
  getInstituteCode() {
    return localStorage.getItem('institutecode');
  }

  getUser() {
    const institutecode = this.getInstituteCode();
    return axios.get(`${USER_API_URL}/getNonDeleted?institutecode=${institutecode}`);
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

  updateDocuments(empID, formData) {
    console.log('Updating Document with id:', empID, formData);
    
    return axios.put(`${USER_API_URL}/updateFiles/${empID}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Axios will automatically set this for FormData
      },
    });
  }
  

  deleteUser(empId) {
    console.log(`Deleting user with ID: ${empId}`);
    return axios.delete(`${USER_API_URL}/softDeleteById/${empId}`);
  }
}

export default new UserService();

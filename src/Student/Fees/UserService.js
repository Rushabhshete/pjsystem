import axios from 'axios';

const API_URL = 'http://localhost:8083';
const institutecode = () => localStorage.getItem("institutecode");

class UserService {
   getUsers() {
    return axios.get(`${API_URL}/getAllFees?institutecode=${institutecode()}`);
   }

  deleteUser(id) {
    return axios.delete(`${API_URL}/deleteFees/${id}?institutecode=${institutecode()}`);
  }

  updateUser(id, userData) {
    return axios.put(`${API_URL}/updateFees/${id}?institutecode=${institutecode()}`, userData)
      .then(response => {
        return response.data; // Return the updated data from the response
      })
      .catch(error => {
        throw error.response.data; // Throw the error message from the response
      });
  }
  
  getUserById(id) {
    return axios.get(`${API_URL}/getFeesById/${id}?institutecode=${institutecode()}`);
  }
}

export default new UserService();

import axios from 'axios';

const API_URL = 'http://13.233.43.240:8083';
const institutecode = () => localStorage.getItem("institutecode");

class StandardService {
  saveStandard(standardData) {
    return axios.post(`${API_URL}/saveStandered?institutecode=${institutecode()}`, standardData);
  }

  getAllStandards() {
    return axios.get(`${API_URL}/getallStandered?institutecode=${institutecode()}`);
  }

  getStandardById(id) {
    return axios.get(`${API_URL}/getStanderedById/${id}?institutecode=${institutecode()}`);
  }

  updateStandard(id, standardData) {
    return axios.put(`${API_URL}/updateStandered/${id}?institutecode=${institutecode()}`, standardData)
      .then(response => {
        return response.data; // Return the updated data from the response
      })
      .catch(error => {
        throw error.response.data; // Throw the error message from the response
      });
  }

  deleteStandard(id) {
    return axios.delete(`${API_URL}/deleteStanderedById/${id}?institutecode=${institutecode()}`);
  }
  
  getStandardByName(name) {
    return axios.get(`${API_URL}/getstanderedByName/${name}?institutecode=${institutecode()}`);
  }
}

export default new StandardService();

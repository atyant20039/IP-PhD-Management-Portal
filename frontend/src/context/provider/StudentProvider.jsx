import { useState, useEffect } from "react";
import StudentContext from "../StudentContext";
import axios from "axios";
import convertFiltersToString from "../../utils/queryStringConvertor";

const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState(null);
  const [error, setError] = useState(null);

  const API = import.meta.env.VITE_BACKEND_URL;

  const fetchStudents = async ({
    page = 1,
    search = "",
    sort = "rollNumber",
    setLoading = null,
    filters = {} 
  } = {}) => {
    try {    
      console.log(page)
      const filterString = convertFiltersToString(filters); 
      const response = await axios.get(
        `${API}/api/studentTable/?page=${page}&search=${search}&sort=${sort}&${filterString}` 
      );
      setLoading && setLoading(false);
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
   
    }
  };

  const addStudent = async (studentData) => {
    console.log(studentData)
    try {
      const response = await axios.post(`${API}/api/studentTable/`, studentData);
      console.log('Student added:', response.data);
      setError(null); // Reset error state
      fetchStudents();
    } catch (error) {
      console.error('Error adding student:', error.response.data);

      setError(error.response.data); // Set error message
    }
  };

  const addStudentbyFile = async (studentData) => {
    console.log(studentData)
    try {
      const response = await axios.post(`${API}/api/studentFile/`, studentData);
      console.log('Student added:', response.data);
      setError(null); // Reset error state
      fetchStudents();
    } catch (error) {
      console.error('Error adding student:', error);
    // Set error message
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    console.log(error)
  }, [error]);

  return (
    <StudentContext.Provider
      value={{ students, setStudents, fetchData: fetchStudents, addStudent, addStudentbyFile, error }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export default StudentProvider;

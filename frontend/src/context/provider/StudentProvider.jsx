import { useState, useEffect } from "react";
import StudentContext from "../StudentContext";
import axios from "axios";
import convertFiltersToString from "../../utils/queryStringConvertor";

const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState(null);
  const [eligibleStudentList, setEligibleStudentList] = useState(null)
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
      const filterString = convertFiltersToString(filters); 
      const response = await axios.get(
        `${API}/api/studentTable/?page=${page}&search=${search}&sort=${sort}&${filterString}` 
      );
      setLoading && setLoading(false);
      setStudents(response.data);
      console.log(students)

    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error);
    }
  };


  const fetchEligibleStudentList = async ({
    month = "",
    year = "",
  } = {}) => {
    try {
      const response = await axios.get(
        `${API}/api/stipendEligible/?month=${month}&year=${year}`
      );
  
      // Add "Eligible" key with value "Yes" to each student object
      const studentsWithEligibility = response.data.map(student => ({
        ...student,
        eligible: "Yes"
      }));
      console.log(studentsWithEligibility)
  
      setEligibleStudentList(studentsWithEligibility);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error);
    }
  };
  

  const addStudent = async (studentData) => {
    try {
      const response = await axios.post(`${API}/api/studentTable/`, studentData);
      setError(prevError => prevError === null ? false : null);
      // Reset error state
      fetchStudents();
    } catch (error) {
      console.error('Error adding student:', error.response.data);
      setError(error.response.data); // Set error message
    }
  };

  const editStudent = async (studentId, updatedStudentData) => {
    console.log(studentId,updatedStudentData)
    try {
      const response = await axios.put(`${API}/api/student/${studentId}/`, updatedStudentData);
      setError(null); // Reset error state
      console.log(response)
      fetchStudents();
    } catch (error) {
      console.error('Error editing student:', error.response.data);
      // setError(error.response.data); // Set error message
    }
  };
  const deleteStudent = async (studentId) => {
    try {
      const response = await axios.delete(`${API}/api/studentTable/${studentId}`);
      setError(null); // Reset error state
      fetchStudents();
    } catch (error) {
      console.error(`Error deleting student with ID ${studentId}:`, error);
      setError(error.response.data);
    }
  };

  const addStudentbyFile = async (studentData) => {
    try {
      const response = await axios.post(`${API}/api/studentFile/`, studentData);
      setError(null); // Reset error state
      fetchStudents();
    } catch (error) {
      console.error('Error adding student:', error);
      setError(error.response.data);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    console.log(error);
  }, [error]);

  return (
    <StudentContext.Provider
      value={{ students, setStudents, fetchData: fetchStudents, addStudent, editStudent, addStudentbyFile, error ,deleteStudent,fetchEligibleStudentList,eligibleStudentList,setEligibleStudentList}}
    >
      {children}
    </StudentContext.Provider>
  );
};

export default StudentProvider;
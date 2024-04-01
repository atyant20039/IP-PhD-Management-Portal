import { useState, useEffect } from "react";
import StudentContext from "../StudentContext";
import axios from "axios";

const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState(null);

  const API = import.meta.env.VITE_BACKEND_URL;

  const fetchStudents = async ({
    page = 1,
    search = "",
    sort = "rollNumber",
    setLoading = null,
    filters = {} // Assign default value as an empty object for filters
  } = {}) => {
    try {
      // Convert filter object to a string that can be passed to the API
      const filterString = Object.entries(filters)
        .filter(([key, value]) => value !== "") // Remove empty values
        .map(([key, value]) => `${key}=${value}`)
        .join("&");
  
      const response = await axios.get(
        `${API}/api/studentTable/?page=${page}&search=${search}&sort=${sort}&${filterString}` // Concatenate filter parameter properly
      );
      setLoading && setLoading(false);
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <StudentContext.Provider
      value={{ students, setStudents, fetchData: fetchStudents }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export default StudentProvider;

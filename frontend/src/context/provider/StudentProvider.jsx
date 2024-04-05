import { useState, useEffect } from "react";
import StudentContext from "../StudentContext";
import axios from "axios";

const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState(null);

  const API = import.meta.env.VITE_BACKEND_URL;

  const fetchStudents = async (
    page = 1,
    search = "",
    sort = "rollNumber",
    setLoading = null
  ) => {
    console.log(
      `${API}/api/studentTable/?page=${page}&search=${search}&sort=${sort}`
    );
    try {
      setLoading && setLoading(true);
      const response = await axios.get(
        `${API}/api/studentTable/?page=${page}&search=${search}&sort=${sort}`
      );
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading && setLoading(false);
    }
  };

  useEffect(() => {
    if (students === null) {
      fetchStudents();
    }
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

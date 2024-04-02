import { useState, useEffect } from "react";
import FacultyContext from "../FacultyContext";
import axios from "axios";
import convertFiltersToString from "../../utils/queryStringConvertor";
const FacultyProvider = ({ children }) => {
  const [faculty, setFaculty] = useState(null);

  const API = import.meta.env.VITE_BACKEND_URL;

  const fetchFaculty = async (
    page = 1,
    search = "",
    sort = "name",
    setLoading = null,
    filters = {}
  ) => {
    try {
      const filterString = convertFiltersToString(filters); 

      const response = await axios.get(
        `${API}/api/instructor/?page=${page}&search=${search}&sort=${sort}&${filterString}`
      );
      setLoading && setLoading(false);
      setFaculty(response.data);
      console.log(faculty)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  return (
    <FacultyContext.Provider
      value={{ faculty, setFaculty, fetchData: fetchFaculty }}
    >
      {children}
    </FacultyContext.Provider>
  );
};

export default FacultyProvider;

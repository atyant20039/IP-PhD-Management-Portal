import axios from "axios";
import { useEffect, useState } from "react";
import stringifyFilters from "../../utils/stringifyFilters";
import FacultyContext from "../FacultyContext";
const FacultyProvider = ({ children }) => {
  const [faculty, setFaculty] = useState(null);
  var Error = null;

  const API = import.meta.env.VITE_BACKEND_URL;

  const fetchFaculty = async (
    page = 1,
    search = "",
    sort = "name",
    setLoading = null,
    filters = {}
  ) => {
    try {
      const filterString = stringifyFilters(filters);

      const response = await axios.get(
        `${API}/api/instructor/?page=${page}&search=${search}&sort=${sort}&${filterString}`
      );
      setFaculty(response.data);
    } catch (error) {
      Error = error.response?.data
        ? Object.values(error.response.data)
        : [error.message];
      return Error;
    } finally {
      setLoading && setLoading(false);
    }
  };

  const addFaculty = async (ProfData) => {
    try {
      await axios.post(`${API}/api/instructor/`, ProfData);
      fetchFaculty();
    } catch (error) {
      Error = error.response?.data
        ? Object.values(error.response.data)
        : [error.message];
      return Error;
    }
  };

  const updateFaculty = async (id, ProfData) => {
    try {
      await axios.put(`${API}/api/instructor/${id}/`, ProfData);
      setFaculty((prevFaculty) => {
        const updatedResults = prevFaculty.results.map((facultyItem) =>
          facultyItem.id === id ? { ...facultyItem, ...ProfData } : facultyItem
        );
        return { ...prevFaculty, results: updatedResults };
      });
    } catch (error) {
      Error = error.response?.data
        ? Object.values(error.response.data)
        : [error.message];
      return Error;
    }
  };

  const deleteFaculty = async (id) => {
    try {
      await axios.delete(`${API}/api/instructor/${id}/`);
      setFaculty((prevFaculty) => {
        const filteredResults = prevFaculty.results.filter(
          (facultyItem) => facultyItem.id !== id
        );
        return { ...prevFaculty, results: filteredResults };
      });
    } catch (error) {
      Error = error.response?.data
        ? Object.values(error.response.data)
        : [error.message];
      return Error;
    }
  };

  useEffect(() => {
    if (faculty === null) {
      fetchFaculty();
    }
  }, []);

  return (
    <FacultyContext.Provider
      value={{
        faculty,
        setFaculty,
        fetchData: fetchFaculty,
        Error,
        addFaculty,
        updateFaculty,
        deleteFaculty,
      }}
    >
      {children}
    </FacultyContext.Provider>
  );
};

export default FacultyProvider;

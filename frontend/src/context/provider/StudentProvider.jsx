import axios from "axios";
import { useEffect, useState } from "react";
import stringifyFilters from "../../utils/stringifyFilters";
import StudentContext from "../StudentContext";

const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState(null);
  var Error = null;

  const API = import.meta.env.VITE_BACKEND_URL;

  const fetchStudents = async (
    page = 1,
    search = "",
    sort = "rollNumber",
    setLoading = null,
    filters = {}
  ) => {
    try {
      setLoading && setLoading(true);
      const filterString = stringifyFilters(filters);
      const response = await axios.get(
        `${API}/api/studentTable/?page=${page}&search=${search}&ordering=${sort}&${filterString}`
      );
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching data:", error.response.data);
      Error = error.response?.data
        ? Object.values(error.response.data)
        : [error.message];
    } finally {
      setLoading && setLoading(false);
    }
  };

  const downloadStudents = async (
    search = "",
    sort = "rollNumber",
    filters = {}
  ) => {
    try {
      const filterString = stringifyFilters(filters);
      const response = await axios.get(
        `${API}/api/studentDownload/?search=${search}&ordering=${sort}&${filterString}`,
        {
          responseType: "blob",
        }
      );

      const file = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const fileURL = URL.createObjectURL(file);

      const fileLink = document.createElement("a");
      fileLink.href = fileURL;
      fileLink.setAttribute("download", "students_data.xlsx");
      document.body.appendChild(fileLink);
      fileLink.click();
      fileLink.remove();
      URL.revokeObjectURL(fileURL);
    } catch (error) {
      console.error("Error fetching data:", error.response.data);
      Error = error.response?.data
        ? Object.values(error.response.data)
        : [error.message];
    }
  };

  const getStudentFileTemplate = async () => {
    try {
      const response = await axios.get(`${API}/api/studentFile/`, {
        responseType: "blob",
      });

      const file = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const fileURL = URL.createObjectURL(file);

      const fileLink = document.createElement("a");
      fileLink.href = fileURL;
      fileLink.setAttribute("download", "students_template.xlsx");
      document.body.appendChild(fileLink);
      fileLink.click();
      fileLink.remove();
      URL.revokeObjectURL(fileURL);
    } catch (error) {
      console.error("Error fetching data:", error.response.data);
      Error = error.response?.data
        ? Object.values(error.response.data)
        : [error.message];
    }
  };

  useEffect(() => {
    if (students === null) {
      fetchStudents();
    }
  }, []);

  return (
    <StudentContext.Provider
      value={{
        students,
        setStudents,
        fetchData: fetchStudents,
        downloadStudents,
        getTemplate: getStudentFileTemplate,
        Error,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export default StudentProvider;

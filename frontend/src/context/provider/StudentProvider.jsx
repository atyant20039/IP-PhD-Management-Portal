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
      Error = error.response?.data
        ? Object.values(error.response.data)
        : [error.message];
      return Error;
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
      Error = error.response?.data
        ? Object.values(error.response.data)
        : [error.message];
      return Error;
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
      Error = error.response?.data
        ? Object.values(error.response.data)
        : [error.message];
      return Error;
    }
  };

  const uploadStudentFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      await axios.post(`${API}/api/studentFile/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      Error = error.response?.data?.error
        ? error.response.data.error
        : error.message;

      const invalidData = error.response?.data?.invalid_data
        ? error.response.data.invalid_data
        : null;
      return { error: Error, invalidData: invalidData };
    }
  };

  const addStudent = async (data) => {
    try {
      await axios.post(`${API}/api/studentTable/`, data);
      fetchStudents();
    } catch (error) {
      Error = error.response?.data
        ? Object.values(error.response.data)
        : [error.message];
      return Error;
    }
  };

  const updateStudent = async (id, data) => {
    try {
      await axios.put(`${API}/api/studentTable/${id}/`, data);
      setStudents((prevStudent) => {
        const updatedResults = prevStudent.results.map((studentItem) => {
          return studentItem.id === id
            ? { ...studentItem, ...data }
            : studentItem;
        });
        return { ...prevStudent, results: updatedResults };
      });
    } catch (error) {
      Error = error.response?.data
        ? Object.values(error.response.data)
        : [error.message];
      return Error;
    }
  };

  const deleteStudent = async (id) => {
    try {
      await axios.delete(`${API}/api/studentTable/${id}/`);
      setStudents((prevStudents) => {
        const filteredResults = prevStudents.results.filter(
          (studentItem) => studentItem.id !== id
        );
        return { ...prevStudents, results: filteredResults };
      });
    } catch (error) {
      Error = error.response?.data
        ? Object.values(error.response.data)
        : [error.message];
      return Error;
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
        uploadFile: uploadStudentFile,
        addStudent,
        updateStudent,
        deleteStudent,
        Error,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export default StudentProvider;

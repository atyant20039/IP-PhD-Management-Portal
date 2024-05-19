import { useEffect, useState } from "react";
import convertDataToXLSX from "../../components/utils/TabletoXlxs";
import InvigilationContext from "../InvigilationContext";
const InvigilationProvider = ({ children }) => {
  const [buildingRoomMap, setBuildingRoomMap] = useState({});
  const [courseCode, setCourseCode] = useState([]);
  const [classroom, setClassroom] = useState([]);
  const [TA, setTA] = useState([]);
  const [Datesheet, setDatesheet] = useState([]);
  const [uploadFile, setuploadFile] = useState(null);
  const [uploadFile1, setuploadFile1] = useState(null);

  const [TARatio, setTARatio] = useState(null);

  const API = import.meta.env.VITE_BACKEND_URL;

  const fetchData = async () => {
    try {
      const response = await fetch(`${API}/api/classroom`);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();

      const buildingRoomMapping = data.results.reduce((acc, curr) => {
        if (!acc[curr.building]) {
          acc[curr.building] = [];
        }
        acc[curr.building].push({
          roomNo: curr.roomNo,
          capacity: curr.capacity,
        });
        return acc;
      }, {});

      setBuildingRoomMap(buildingRoomMapping);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const uploadData = async () => {
    console.log("function is called");
    try {
      const classroomXLSX = await convertDataToXLSX(
        classroom,
        "Classroom.xlsx"
      );
      const TAXLSX = await convertDataToXLSX(TA, "TA.xlsx");
      const DatesheetXLSX = await convertDataToXLSX(
        Datesheet,
        "Datesheet.xlsx"
      );

      console.log(classroomXLSX, TAXLSX, DatesheetXLSX);

      const formData = new FormData();
      formData.append("file1", uploadFile, "StudentRegistration.xlsx");
      formData.append("file2", uploadFile1, "StudentList.xlsx");
      formData.append("file3", classroomXLSX);
      formData.append("file4", TAXLSX);
      formData.append("file5", DatesheetXLSX);
      formData.append("TARatio", TARatio);

      const response = await fetch(`${API}/api/allotment/`, {
        //change API
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to upload files");
      }
      const data = await response.json();
      console.log("Files uploaded successfully:", data);
      e;
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  useEffect(() => {
    fetchData();
    console.log(TA, classroom, Datesheet, uploadFile, uploadFile1, TARatio);
  }, [TA, classroom, Datesheet, uploadFile, uploadFile1, TARatio]);

  return (
    <InvigilationContext.Provider
      value={{
        buildingRoomMap,
        setCourseCode,
        setTARatio,
        TARatio,
        courseCode,
        setClassroom,
        setDatesheet,
        setuploadFile,
        setuploadFile1,
        setTA,
        uploadData,
      }}
    >
      {children}
    </InvigilationContext.Provider>
  );
};

export default InvigilationProvider;

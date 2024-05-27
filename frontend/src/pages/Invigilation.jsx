import React, { useState } from "react";
import Classroom from "../components/Invigilation_Classroom";
import Invigilation_DateSheet from "../components/Invigilation_DateSheet";
import Invigilation_TA from "../components/Invigilation_TA";
import Invigilation_TARatio from "../components/Invigilation_TARatio";
import { ProgressStepper } from "../components/ProgressStepper";

import axios from "axios";

import Invigilation_EligibleStudents from "../components/Invigilation_EligibleStudents";
import Invigilation_StudentRegistration from "../components/Invigilation_StudentRegistration";

function Invigilation() {
  const API = import.meta.env.VITE_BACKEND_URL;
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(-1);
  const [classroomFile, setClassroomFile] = useState();
  const [taRatio, setTaRatio] = useState();

  const handleNextStep = () => {
    setCompletedSteps((prevSteps) => prevSteps + 1);
    setActiveStep((prevStep) => prevStep + 1);
  };

  const finalSubmit = async () => {
    try {
      if (!taRatio || taRatio == null) {
        // alert("TA Ratio invalid value");
        swal("Invalid Input", "TA Ratio invalid value", "error");
        return;
      }
      if (!classroomFile || classroomFile == null) {
        // alert("Error generating Classroom XLSX file");
        swal(
          "Error",
          "Error generating Classroom XLSX file. Please try again after some time.",
          "error"
        );
        return;
      }

      const formData = new FormData();
      formData.append("file1", classroomFile);
      formData.append("TARatio", taRatio);

      const response = await axios.post(`${API}/api/allotment/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob",
      });

      if (response.status === 200) {
        // alert("Process Successful");
        swal(
          "Success",
          "Invigilation duties allocated. The file will start downloading automatically.",
          "success"
        );
        const file = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const fileURL = URL.createObjectURL(file);

        const fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute("download", "invigilationDuties.xlsx");
        document.body.appendChild(fileLink);
        fileLink.click();
        fileLink.remove();
        URL.revokeObjectURL(fileURL);
      }
    } catch (error) {
      // alert("Some Error occured");
      swal("Error", error.response?.data?.error, "error");
      console.error(error);
    }
  };

  const renderActiveComponent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Classroom
            onSubmit={handleNextStep}
            setClassroomFile={setClassroomFile}
          />
        );
      case 1:
        return <Invigilation_DateSheet onSubmit={handleNextStep} />;
      case 2:
        return (
          <Invigilation_TARatio
            onSubmit={handleNextStep}
            taRatio={taRatio}
            setTaRatio={setTaRatio}
          />
        );
      case 3:
        return <Invigilation_TA onSubmit={handleNextStep} />;
      case 4:
        return <Invigilation_StudentRegistration onSubmit={handleNextStep} />;
      case 5:
        return <Invigilation_EligibleStudents onSubmit={finalSubmit} />;

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div>
        <ProgressStepper
          setActiveStep={setActiveStep}
          activeStep={activeStep}
          completedSteps={completedSteps}
        />
      </div>
      <div className="h-1 flex-1 overflow-auto">{renderActiveComponent()}</div>
    </div>
  );
}

export default Invigilation;

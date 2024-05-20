import React, { useContext, useState } from "react";
import Classroom from "../components/Invigilation_Classroom";
import Invigilation_DateSheet from "../components/Invigilation_DateSheet";
import Invigilation_TA from "../components/Invigilation_TA";
import { ProgressStepper } from "../components/ProgressStepper";

import Invigilation_EligibleStudents from "../components/Invigilation_EligibleStudents";
import Invigilation_StudentRegistration from "../components/Invigilation_StudentRegistration";
import InvigilationContext from "../context/InvigilationContext";

function Invigilation() {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(-1);
  const { uploadData } = useContext(InvigilationContext);

  const handleNextStep = () => {
    setCompletedSteps((prevSteps) => prevSteps + 1);
    setActiveStep((prevStep) => prevStep + 1);
  };

  const renderActiveComponent = () => {
    switch (activeStep) {
      case 0:
        return <Classroom onSubmit={handleNextStep} />;
      case 1:
        return <Invigilation_DateSheet onSubmit={handleNextStep} />;
      case 2:
        return <Invigilation_TA onSubmit={handleNextStep} />;
      case 3:
        return <Invigilation_StudentRegistration onSubmit={handleNextStep} />;
      case 4:
        return <Invigilation_EligibleStudents onSubmit={handleNextStep} />;

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
        {/* <div className="flex justify-center mt-4">
          <Button color="green" disabled={activeStep != 5} onClick={uploadData}>
            Generate!
          </Button>
        </div> */}
      </div>
      <div className="h-1 flex-1 overflow-auto">{renderActiveComponent()}</div>
    </div>
  );
}

export default Invigilation;

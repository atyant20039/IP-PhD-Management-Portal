import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import { ProgressStepper } from "../components/ProgressStepper";
import Classroom from "../components/Invigilation_classroom";
import Invigilation_DateSheet from "../components/Invigilation_DateSheet";
import Invigilation_Files from "../components/Invigilation_Files";
import Invigilation_TA from "../components/Invigilation_TA";

function Invigilation() {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  const handleNextStep = () => {
    setCompletedSteps((prevSteps) => [...prevSteps, activeStep]);
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
        return <Invigilation_Files onSubmission1={handleNextStep} onSubmission2={handleNextStep} />;
      case 4:
        return <Invigilation_Files onSubmission1={handleNextStep} onSubmission2={handleNextStep} />;

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="h-[33vh] overflow-auto">
        <ProgressStepper setActiveStep={setActiveStep} activeStep={activeStep} completedSteps={completedSteps} />
        <div className="flex justify-center mt-4">
          <Button color="green" disabled={activeStep!=5}>Generate!</Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {renderActiveComponent()}
      </div>
    </div>
  );
}

export default Invigilation;

import React, { useState, useEffect } from "react";
import { Stepper, Step, Typography } from "@material-tailwind/react";
import { UserIcon, CogIcon, BuildingLibraryIcon } from "@heroicons/react/24/outline";

export function ProgressStepper({ isClassroomSubmitted, isDateSheetSubmitted, isTASubmitted, isFileSubmitted1, isFileSubmitted2 }) {
  const [activeStep, setActiveStep] = useState(-1);
  const [isLastStep, setIsLastStep] = useState(false);
  const [isFirstStep, setIsFirstStep] = useState(false);

  useEffect(() => {
    if (isClassroomSubmitted) {
      setActiveStep(0);
    }
  }, [isClassroomSubmitted]);

  useEffect(() => {
    if (isDateSheetSubmitted) {
      setActiveStep(1);
    }
  }, [isDateSheetSubmitted]);

  useEffect(() => {
    if (isTASubmitted) {
      setActiveStep(2);
    }
  }, [isTASubmitted]);

  useEffect(() => {
    if (isFileSubmitted1) {
      setActiveStep(3);
    }
  }, [isFileSubmitted1]);

  useEffect(() => {
    if (isFileSubmitted2) {
      setActiveStep(4);
    }
  }, [isFileSubmitted2]);

  const steps = [
    { icon: UserIcon, title: "Step 1", description: "Details about your account." },
    { icon: CogIcon, title: "Step 2", description: "Details about your account." },
    { icon: BuildingLibraryIcon, title: "Step 3", description: "Details about your account." },
    { icon: UserIcon, title: "Step 4", description: "Details about your account." },
    { icon: CogIcon, title: "Step 5", description: "Details about your account." },
  ];

  return (
    <div className="w-full px-24 py-4 mb-20">
      <Stepper
        activeStep={activeStep}
        isLastStep={(value) => setIsLastStep(value)}
        isFirstStep={(value) => setIsFirstStep(value)}
      >
        {steps.map((step, index) => (
          <Step key={index} onClick={() => setActiveStep(index)}>
            <step.icon className="h-5 w-5" />
            <div className="absolute -bottom-[4.5rem] w-max text-center">
              <Typography
                variant="h6"
                color={activeStep === index ? "blue-gray" : "gray"} // Set color based on active step
              >
                {step.title}
              </Typography>
              <Typography
                color={activeStep === index ? "blue-gray" : "gray"} // Set color based on active step
                className="font-normal"
              >
                {step.description}
              </Typography>
            </div>
          </Step>
        ))}
      </Stepper>
    </div>
  );
}

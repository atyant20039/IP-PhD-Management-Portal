import React from "react";
import { Stepper, Step, Typography } from "@material-tailwind/react";
import { UserIcon, CogIcon, BuildingLibraryIcon } from "@heroicons/react/24/outline";

export function ProgressStepper({ setActiveStep, activeStep, completedSteps }) {
  const steps = [
    { icon: UserIcon, title: "Step 1", description: "Enter Classrooms for allocation" },
    { icon: CogIcon, title: "Step 2", description: "Prepare Datesheet" },
    { icon: BuildingLibraryIcon, title: "Step 3", description: "Enter list of TAs" },
    { icon: UserIcon, title: "Step 4", description: "Enter File 1" },
    { icon: CogIcon, title: "Step 5", description: "Enter File 2" },
  ];

  return (
    <div className="w-full px-14 py-4 mb-16 md:px-16 ">
      <Stepper activeStep={activeStep}>
        {steps.map((step, index) => (
          <Step
            key={index}
            onClick={() => {
              if (completedSteps >= index) {
                setActiveStep(index);
              }
            }}
            disabled={index > activeStep || completedSteps < index}
          >
            <step.icon className="h-5 w-5" />
            <div className="absolute top-[3rem] w-max text-center">
              <Typography
                variant="h6"
                color={activeStep === index ? "blue-gray" : "gray"} 
              >
                {step.title}
              </Typography>
              
              <Typography
                color={activeStep === index ? "blue-gray" : "gray"} 
                className="font-normal max-w-[80px] md:max-w-[120px] lg:max-w-[160px]"
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

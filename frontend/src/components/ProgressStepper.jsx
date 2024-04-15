import React from "react";
import { Stepper, Step, Typography } from "@material-tailwind/react";
import { UserIcon, CogIcon, BuildingLibraryIcon } from "@heroicons/react/24/outline";

export function ProgressStepper({ setActiveStep, activeStep, completedSteps }) {
  const steps = [
    { icon: UserIcon, title: "Step 1", description: "Details about your account." },
    { icon: CogIcon, title: "Step 2", description: "Details about your account." },
    { icon: BuildingLibraryIcon, title: "Step 3", description: "Details about your account." },
    { icon: UserIcon, title: "Step 4", description: "Details about your account." },
    { icon: CogIcon, title: "Step 5", description: "Details about your account." },
  ];

  return (
    <div className="w-full px-24 py-4 mb-20">
      <Stepper activeStep={activeStep}>
        {steps.map((step, index) => (
          <Step key={index}  onClick={() => {
            if (completedSteps >= index) {
              setActiveStep(index);
            }
          }}
          disabled={index > activeStep || completedSteps < index}>
            <step.icon className="h-5 w-5" />
            <div className="absolute -bottom-[4.5rem] w-max text-center">
              <Typography
                variant="h6"
                color={activeStep === index ? "blue-gray" : "gray"} 
              >
                {step.title}
              </Typography>
              <Typography
                color={activeStep === index ? "blue-gray" : "gray"} 
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

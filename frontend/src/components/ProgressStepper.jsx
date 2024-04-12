import React from "react";
import { Stepper, Step, Button, Typography } from "@material-tailwind/react";
import { UserIcon, CogIcon, BuildingLibraryIcon } from "@heroicons/react/24/outline";

export function ProgressStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [isLastStep, setIsLastStep] = React.useState(false);
  const [isFirstStep, setIsFirstStep] = React.useState(false);


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

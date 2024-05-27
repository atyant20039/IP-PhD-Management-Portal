import { BuildingLibraryIcon } from "@heroicons/react/24/outline";
import {
  AdjustmentsHorizontalIcon,
  CalendarDaysIcon,
  ListBulletIcon,
  UserPlusIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import { Step, Stepper, Typography } from "@material-tailwind/react";
import React from "react";

export function ProgressStepper({ setActiveStep, activeStep, completedSteps }) {
  const steps = [
    {
      icon: BuildingLibraryIcon,
      title: "Step 1",
      description: "Classroom",
    },
    { icon: CalendarDaysIcon, title: "Step 2", description: "Datesheet" },
    {
      icon: AdjustmentsHorizontalIcon,
      title: "Step 3",
      description: "TA Student Ratio",
    },
    {
      icon: ListBulletIcon,
      title: "Step 4",
      description: "TA List",
    },
    {
      icon: UserPlusIcon,
      title: "Step 5",
      description: "Student Registration",
    },
    { icon: UsersIcon, title: "Step 6", description: "Eligible Students" },
  ];

  return (
    <div className="w-full px-14 py-4 mb-16 md:px-16 ">
      <Stepper activeStep={activeStep}>
        {steps.map((step, index) => (
          <Step
            key={index}
            onClick={() => {
              if (activeStep >= index) {
                setActiveStep(index);
              }
            }}
            disabled={index > activeStep || completedSteps < index}
            className={`${activeStep >= index ? "cursor-pointer" : ""}`}
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

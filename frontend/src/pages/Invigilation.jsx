import React, { useState, useEffect, useContext } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Chip,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Spinner,
  Button,
} from "@material-tailwind/react";
import {
  AcademicCapIcon,
  Square3Stack3DIcon,
  UserCircleIcon,
  NewspaperIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/solid";
import { XCircleIcon } from "@heroicons/react/24/outline";
import Invigilation_Classroom from "../components/Invigilation_Classroom";
import Invigilation_DateSheet from "../components/Invigilation_DateSheet";
import Invigilation_TA from "../components/Invigilation_TA";
import Invigilation_Files from "../components/Invigilation_Files";
import { ProgressStepper } from "../components/ProgressStepper";

function Invigilation() {
  const [isClassroomSubmitted, setIsClassroomSubmitted] = useState(false);
  const [isDateSheetSubmitted, setIsDateSheetSubmitted] = useState(false);
  const [isTASubmitted, setIsTASubmitted] = useState(false);
  const [isFileSubmitted1, setIsFileSubmitted1] = useState(false);
  const [isFileSubmitted2, setIsFileSubmitted2] = useState(false);

  const [activeTab, setActiveTab] = useState(0); // State to manage active tab

  const tabs = [
    {
      label: "Classroom",
      value: "classroom",
      icon: UserCircleIcon,
      childComponent: (
        <Invigilation_Classroom
          onSubmission={() => setIsClassroomSubmitted(true)}
        />
      ),
      disabled: false, // Enable by default
    },
    {
      label: "Datesheet",
      value: "yearly",
      icon: CalendarDaysIcon,
      childComponent: (
        <Invigilation_DateSheet
          onSubmission={() => setIsDateSheetSubmitted(true)}
        />
      ),
      disabled: !isClassroomSubmitted, // Disable until Classroom is submitted
    },
    {
      label: "TA List",
      value: "TA",
      icon: NewspaperIcon,
      childComponent: (
        <Invigilation_TA onSubmission={() => setIsTASubmitted(true)} />
      ),
      disabled: !isDateSheetSubmitted, // Disable until Datesheet is submitted
    },
    {
      label: "Invigilation Files",
      value: "Invigilation",
      icon: NewspaperIcon,
      childComponent: (
        <Invigilation_Files
          onSubmission1={() => setIsFileSubmitted1(true)}
          onSubmission2={() => setIsFileSubmitted2(true)}
        />
      ),
      disabled: !isTASubmitted, // Disable until TA List is submitted
    },
  ];

  const handleTabChange = (index) => {
    if (!tabs[index].disabled) {
      setActiveTab(index);
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div>
        <Card shadow={false}>
          <CardHeader floated={false} shadow={false}>
            <Typography variant="h4" color="blue-gray">
              Invigilation Files
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col items-center">
            <ProgressStepper
              isClassroomSubmitted={isClassroomSubmitted}
              isDateSheetSubmitted={isDateSheetSubmitted}
              isTASubmitted={isTASubmitted}
              isFileSubmitted1={isFileSubmitted1}
              isFileSubmitted2={isFileSubmitted2}
            />
            <Button color="green" disabled={!isFileSubmitted2}>
              Generate!
            </Button>
          </CardBody>
        </Card>

        <Card shadow={false} className="flex flex-1">
          <CardBody className="px-2 py-1">
            <Tabs value={activeTab} onChange={handleTabChange}>
              <TabsHeader>
                {tabs.map((item, index) => (
                  <Tab
                    key={item.value}
                    value={index}
                    disabled={item.disabled} // Disable if disabled flag is true
                  >
                    <div className="flex items-center gap-2">
                      <item.icon className="size-5" />
                      {item.label}
                    </div>
                  </Tab>
                ))}
              </TabsHeader>
              <TabsBody>
                {tabs.map((item, index) => (
                  <TabPanel key={item.value} value={index}>
                    {item.childComponent}
                  </TabPanel>
                ))}
              </TabsBody>
            </Tabs>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default Invigilation;

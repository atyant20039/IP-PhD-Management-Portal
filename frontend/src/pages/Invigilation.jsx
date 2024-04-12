import { useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";

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
  const id = "MT20202";
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [fileName1, setFileName1] = useState("");
  const [fileName2, setFileName2] = useState("");

  const handleFile1Change = (event) => {
    const selectedFile = event.target.files[0];
    setFile1(selectedFile);
    setFileName1(selectedFile.name);
  };

  const handleFile2Change = (event) => {
    const selectedFile = event.target.files[0];
    setFile2(selectedFile);
    setFileName2(selectedFile.name);
  };

  const saveFiles = () => {
    // You can handle saving the files here
    console.log("File 1:", file1);
    console.log("File 2:", file2);
    // Implement your logic to save the files
  };

  const tabs = [
    {
      label: "Classroom",
      value: "classroom",
      icon: UserCircleIcon,
      childComponent: <Invigilation_Classroom />,
    },
    {
      label: "Datesheet",
      value: "yearly",
      icon: CalendarDaysIcon,
      childComponent: <Invigilation_DateSheet />,
    },
    {
      label: "TA List",
      value: "TA",
      icon: NewspaperIcon,
      childComponent: <Invigilation_TA />,
    },
    {
      label: "Invigilation Files",
      value: "Invigilation",
      icon: NewspaperIcon,
      childComponent: <Invigilation_Files />,
    },
  ];

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
            <ProgressStepper />
          </CardBody>
        </Card>

        <Card shadow={false} className="flex flex-1">
          <CardBody className="px-2 py-1">
            <Tabs value="profile">
              <TabsHeader>
                {tabs.map((item) => (
                  <Tab key={item.value} value={item.value}>
                    <div className="flex items-center gap-2">
                      <item.icon className="size-5" />
                      {item.label}
                    </div>
                  </Tab>
                ))}
              </TabsHeader>
              <TabsBody>
                {tabs.map((item) => (
                  <TabPanel key={item.value} value={item.value}>
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

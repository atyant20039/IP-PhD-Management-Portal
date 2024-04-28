import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Spinner,
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
  Typography,
} from "@material-tailwind/react";

import {
  AcademicCapIcon,
  CalendarDaysIcon,
  NewspaperIcon,
  Square3Stack3DIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";

import { XCircleIcon } from "@heroicons/react/24/outline";

import StudentProfileData from "../components/StudentProfileData";
import StudentProfileExam from "../components/StudentProfileExam";
import StudentProfileLog from "../components/StudentProfileLog";
import StudentProfileReview from "../components/StudentProfileReview";

import StudentContext from "../context/StudentContext";

function StudentProfile() {
  const { id } = useParams();
  const { students, fetchData } = useContext(StudentContext);
  const [loading, setLoading] = useState(true);

  const data = students
    ? students.results
      ? students.results.find((student) => student.rollNumber === id)
      : null
    : null;

  useEffect(() => {
    fetchData(undefined, undefined, undefined, setLoading);
  }, []);

  const tabs = [
    {
      label: "Profile",
      value: "profile",
      icon: UserCircleIcon,
      childComponent: <StudentProfileData data={data} />,
    },
    {
      label: "Yearly Review",
      value: "yearly",
      icon: CalendarDaysIcon,
      childComponent: <StudentProfileReview id={id} />,
    },
    {
      label: "Comprehensive Exam",
      value: "exam",
      icon: NewspaperIcon,
      childComponent: <StudentProfileExam id={id} />,
    },
    {
      label: "Contingency Logbook",
      value: "logbook",
      icon: Square3Stack3DIcon,
      childComponent: <StudentProfileLog id={id} />,
    },
  ];

  const headdetails = [
    {
      key: "Roll Number",
      value: data ? data.rollNumber : "-",
    },
    {
      key: "Email ID",
      value: data ? data.emailId : "-",
    },
    {
      key: "Department",
      value: data ? data.department : "-",
    },
    {
      key: "Advisor 1",
      value: data ? (data.advisor1 ? data.advisor1 : "-") : "-",
    },
  ];

  return (
    <div className="flex flex-col w-full h-full">
      {data ? (
        <div>
          <Card shadow={false}>
            <CardHeader floated={false} shadow={false}>
              <Typography variant="h4" color="blue-gray">
                Student Details
              </Typography>
            </CardHeader>
            <CardBody className="flex flex-row flex-1">
              <AcademicCapIcon className="size-10 md:size-16 xl:size-20 text-blue-gray-900" />
              <div className="ml-10 h-full flex flex-col flex-1">
                <div className="flex flex-row">
                  <Typography variant="h5" color="blue-gray">
                    {data.name}
                  </Typography>
                  <Chip
                    variant="ghost"
                    size="sm"
                    className="px-2 mx-4"
                    value={data.studentStatus}
                    icon={
                      <span
                        className={`mx-auto mt-1 block h-2 w-2 rounded-full content-[''] ${
                          data.studentStatus === "Active"
                            ? "bg-green-900"
                            : data.studentStatus === "Terminated"
                            ? "bg-red-900"
                            : data.studentStatus === "Semester Leave"
                            ? "bg-amber-900"
                            : data.studentStatus === "Shifted"
                            ? "bg-blue-900"
                            : data.studentStatus === "Graduated"
                            ? "bg-gray-900"
                            : "bg-blue-gray-900"
                        }`}
                      />
                    }
                    color={
                      data.studentStatus === "Active"
                        ? "green"
                        : data.studentStatus === "Terminated"
                        ? "red"
                        : data.studentStatus === "Semester Leave"
                        ? "amber"
                        : data.studentStatus === "Shifted"
                        ? "blue"
                        : data.studentStatus === "Graduated"
                        ? "gray"
                        : "blue-gray"
                    }
                  />
                </div>
                <div className="mt-2 grid grid-cols-4 grid-rows-3">
                  {headdetails.map((item, index) => (
                    <div key={index}>
                      <Typography variant="small"> {item.key} </Typography>
                    </div>
                  ))}
                  {headdetails.map((item, index) => (
                    <div key={index} className="row-span-2">
                      <Typography variant="h6" className="text-blue-gray-800">
                        {item.value}
                      </Typography>
                    </div>
                  ))}
                </div>
              </div>
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
      ) : (
        <div className="w-full h-full flex flex-col place-content-center place-items-center">
          {loading ? (
            <Spinner className="size-12" />
          ) : (
            <div>
              <XCircleIcon className="h-48 w-48" />
              <Typography variant="h3">No Data Found</Typography>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default StudentProfile;

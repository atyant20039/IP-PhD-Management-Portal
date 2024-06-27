import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import axios from "axios";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Dialog,
  DialogBody,
  DialogHeader,
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
  PencilIcon,
  Square3Stack3DIcon,
  TrashIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";

import { XCircleIcon } from "@heroicons/react/24/outline";

import StudentProfileData from "../components/StudentProfileData";
import StudentProfileExam from "../components/StudentProfileExam";
import StudentProfileLog from "../components/StudentProfileLog";
import StudentProfileReview from "../components/StudentProfileReview";

import DeleteDialog from "../components/DeleteDialog";
import StudentForm from "../components/StudentForm";

function StudentProfile() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setDeleteDialog] = useState(false);
  const [isUpdateDialogOpen, setUpdateDialog] = useState(false);
  const [data, setData] = useState();
  const API = import.meta.env.VITE_BACKEND_URL;

  const handleDelete = () => {
    setDeleteDialog(!isDeleteDialogOpen);
  };

  const handleUpdate = () => {
    setUpdateDialog(!isUpdateDialogOpen);
  };

  useEffect(() => {
    async function fetcher() {
      try {
        setLoading(true);
        const response = await axios.get(`${API}/api/studentTable/${id}/`);
        setData(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetcher();
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
      childComponent: <StudentProfileReview rno={id} id={data?.id} />,
    },
    {
      label: "Comprehensive Exam",
      value: "exam",
      icon: NewspaperIcon,
      childComponent: <StudentProfileExam rno={id} id={data?.id} />,
    },
    {
      label: "Contingency Logbook",
      value: "logbook",
      icon: Square3Stack3DIcon,
      childComponent: <StudentProfileLog rno={id} id={data?.id} />,
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
    <div className="flex flex-col h-full">
      {data ? (
        <div className="flex flex-col h-full">
          <Card shadow={false}>
            <CardHeader floated={false} shadow={false}>
              <Typography variant="h4" color="blue-gray">
                Student Details
              </Typography>
            </CardHeader>
            <CardBody className="flex flex-row flex-1">
              <AcademicCapIcon className="size-10 md:size-16 xl:size-20 text-blue-gray-900" />
              <div className="ml-10 h-full flex flex-col flex-1">
                <div className="flex flex-row justify-between items-center">
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
                  <div className="flex items-center space-x-3">
                    <Button
                      className="flex items-center space-x-2 py-2"
                      variant="outlined"
                      size="sm"
                      onClick={handleUpdate}
                    >
                      <PencilIcon className="size-4" />
                      <span>Edit</span>
                    </Button>
                    <Button
                      className="flex items-center space-x-2 py-2"
                      variant="outlined"
                      size="sm"
                      color="red"
                      onClick={handleDelete}
                    >
                      <TrashIcon className="size-4" />
                      <span>Delete</span>
                    </Button>
                    <Dialog
                      open={isUpdateDialogOpen}
                      handler={handleUpdate}
                      className="max-h-[90vh]"
                    >
                      <DialogHeader className="cursor-default max-h-[10vh]">
                        Edit Student
                      </DialogHeader>
                      <DialogBody className="overflow-auto max-h-[75vh]">
                        <StudentForm setOpen={setUpdateDialog} initVal={data} />
                      </DialogBody>
                    </Dialog>
                    <DeleteDialog
                      isOpen={isDeleteDialogOpen}
                      setOpen={setDeleteDialog}
                      row={data}
                      model="student"
                    />
                  </div>
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
          <div className="px-2 flex-1 overflow-auto">
            <Tabs value="profile" className="h-full w-full flex flex-col">
              <TabsHeader className="bg-gray-300/50">
                {tabs.map((item) => (
                  <Tab key={item.value} value={item.value}>
                    <div className="flex items-center gap-2">
                      <item.icon className="size-5" />
                      {item.label}
                    </div>
                  </Tab>
                ))}
              </TabsHeader>
              <TabsBody className="flex-1">
                {tabs.map((item) => (
                  <TabPanel
                    key={item.value}
                    value={item.value}
                    className="px-0 py-2 h-full flex"
                  >
                    <div className="flex-1 w-full">{item.childComponent}</div>
                  </TabPanel>
                ))}
              </TabsBody>
            </Tabs>
          </div>
        </div>
      ) : (
        <div className="h-full w-full flex flex-col place-content-center place-items-center">
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

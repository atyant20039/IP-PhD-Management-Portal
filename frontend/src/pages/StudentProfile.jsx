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
  Spinner,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Alert,
  Button,
} from "@material-tailwind/react";

import {
  AcademicCapIcon,
  CalendarDaysIcon,
  NewspaperIcon,
  PencilIcon,
  Square3Stack3DIcon,
  TrashIcon,
  UserCircleIcon,
  NewspaperIcon,
  CalendarDaysIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

import Select from "react-select";
import axios from "axios";

import { XCircleIcon } from "@heroicons/react/24/outline";
import StudentProfileData from "../components/StudentProfileData";
import StudentProfileExam from "../components/StudentProfileExam";
import StudentProfileLog from "../components/StudentProfileLog";
import StudentProfileReview from "../components/StudentProfileReview";
import StudentContext from "../context/StudentContext";
import FacultyContext from "../context/FacultyContext";

import { useNavigate } from "react-router-dom"; // Import useHistory hook

function EditStudentForm({ isOpen, onClose, prevData }) {
  const { editStudent, error } = useContext(StudentContext);

  const { fetchData, faculty } = useContext(FacultyContext);
  const [facultyOptions, setFacultyOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertOpen, setAlertOpen] = useState(false);

  useEffect(() => {
    if (prevData) {
      // Set studentData if prevData is available
      setStudentData({
        ...prevData,
        gender: prevData.gender || "",
        department: prevData.department || "",
        joiningDate: prevData.joiningDate || "",
        batch: prevData.batch || "",
        educationalQualification: prevData.educationalQualification || null,
        region: prevData.region || null,
        admissionThrough: prevData.admissionThrough || "",
        fundingType: prevData.fundingType || "",
        sourceOfFunding: prevData.sourceOfFunding || null,
        contingencyPoints: prevData.contingencyPoints || 20000,
        studentStatus: prevData.studentStatus || "",
        thesisSubmissionDate: prevData.thesisSubmissionDate || null,
        thesisDefenceDate: prevData.thesisDefenceDate || null,
        yearOfLeaving: prevData.yearOfLeaving || null,
        comment: prevData.comment || "",
        advisor1: prevData.advisor1 || "null@iiitd.ac.in",
        advisor2: prevData.advisor2 || "null@iiitd.ac.in",
        coadvisor: prevData.coadvisor || "null@iiitd.ac.in",
      });
      setLoading(false); // Set loading to false once studentData is set
    }
  }, [prevData]);

  useEffect(() => {
    if (error) {
      setAlertOpen(true);
    }
    if (!error) {
      onClose();
    }
    console.log(prevData);
  }, []);

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };
  const [studentData, setStudentData] = useState({
    rollNumber: "",
    name: "",
    emailId: "",
    gender: "",
    department: "",
    joiningDate: "",
    batch: "",
    educationalQualification: null,
    region: null,
    admissionThrough: "",
    fundingType: "",
    sourceOfFunding: null,
    contingencyPoints: 20000,
    studentStatus: "",
    thesisSubmissionDate: null,
    thesisDefenceDate: null,
    yearOfLeaving: null,
    comment: "",
    advisor1: "null@iiitd.ac.in",
    advisor2: "null@iiitd.ac.in",
    coadvisor: "null@iiitd.ac.in",
  });

  const handleAdvisorChange = (selectedOption, field) => {
    // Remove quotes from field
    field = field.substring(0, field.length);
    console.log(field);

    setStudentData((prevData) => ({
      ...prevData,
      [field]: selectedOption.value, // Set the whole selectedOption object
    }));

    console.log(studentData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);

    setStudentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchFacultyData = async () => {
      setLoading(true);
      try {
        fetchData(1, "");
        console.log(faculty);
        // Format faculty data into options array
        const options = faculty.results.map((advisor) => ({
          value: advisor.emailId,
          label: advisor.name,
        }));
        // Set options in state
        setFacultyOptions(options);
      } catch (error) {
        console.error("Error fetching faculty data:", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch faculty data when component mounts
    fetchFacultyData();
  }, []);

  const handleEditStudent = () => {
    console.log(studentData);
    editStudent(prevData.rollNumber, studentData);
    onClose();
  };

  const requiredFields = [
    "rollNumber",
    "name",
    "emailId",
    "gender",
    "department",
    "joiningDate",
    "batch",
    "admissionThrough",
    "fundingType",
    "contingencyPoints",
    "studentStatus",
  ];

  const isAllFieldsFilled = requiredFields.every(
    (field) => !!studentData[field]
  );

  if (loading) {
    // Render loading state until studentData is set
    return <p>Loading...</p>;
  }

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogHeader>Add Student</DialogHeader>
      <DialogBody className="max-h-96 overflow-y-auto">
        <form className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label htmlFor="rollNumber" className="text-base">
              Roll Number: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="rollNumber"
              name="rollNumber"
              value={studentData.rollNumber}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="name" className="text-base">
              Name: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={studentData.name}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="emailId" className="text-base">
              Email ID: <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="emailId"
              name="emailId"
              value={studentData.emailId}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="gender" className="text-base">
              Gender: <span className="text-red-500">*</span>
            </label>
            <select
              id="gender"
              name="gender"
              value={studentData.gender}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-200"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Others">Others</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="department" className="text-base">
              Department: <span className="text-red-500">*</span>
            </label>
            <select
              id="department"
              name="department"
              value={studentData.department}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-200"
              required
            >
              <option value="">Select Department</option>
              <option value="CSE">CSE</option>
              <option value="CB">CB</option>
              <option value="ECE">ECE</option>
              <option value="HCD">HCD</option>
              <option value="SSH">SSH</option>
              <option value="MATHS">MATHS</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="joiningDate" className="text-base">
              Joining Date: <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="joiningDate"
              name="joiningDate"
              value={studentData.joiningDate}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="batch" className="text-base">
              Batch: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="batch"
              name="batch"
              placeholder="Month YYYY"
              value={studentData.batch}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="educationalQualification" className="text-base">
              Educational Qualification:
            </label>
            <input
              type="text"
              id="educationalQualification"
              name="educationalQualification"
              value={studentData.educationalQualification}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          {/* Advisor 1 Email ID Dropdown */}

          <div>
            <div className="mb-4">
              <label htmlFor="advisor1" className="text-base">
                Advisor 1
              </label>
              <Select
                id="advisor1"
                name="advisor1"
                value={studentData.advisor1.value}
                onChange={(selectedOption) =>
                  handleAdvisorChange(selectedOption, "advisor1")
                }
                options={facultyOptions}
                isLoading={loading}
                className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-200"
                placeholder="Select Advisor"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="advisor2" className="text-base">
                Advisor 2
              </label>
              <Select
                id="advisor2"
                name="advisor2"
                value={studentData.advisor2.value}
                onChange={(selectedOption) =>
                  handleAdvisorChange(selectedOption, "advisor2")
                }
                options={facultyOptions}
                isLoading={loading}
                className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-200"
                placeholder="Select Advisor"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="coadvisor" className="text-base">
                Co-advisor
              </label>
              <Select
                id="coadvisor"
                name="coadvisor"
                value={studentData.coadvisor.value}
                onChange={(selectedOption) =>
                  handleAdvisorChange(selectedOption, "coadvisor")
                }
                options={facultyOptions}
                isLoading={loading}
                className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-200"
                placeholder="Select Advisor"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="region" className="text-base">
              Region:
            </label>
            <select
              id="region"
              name="region"
              value={studentData.region}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-200"
            >
              <option value="">Select Region</option>
              <option value="Delhi">Delhi</option>
              <option value="Outside Delhi">Outside Delhi</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="admissionThrough" className="text-base">
              Admission Through: <span className="text-red-500">*</span>
            </label>
            <select
              id="admissionThrough"
              name="admissionThrough"
              value={studentData.admissionThrough}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-200"
            >
              <option value="">Select Admission Through</option>
              <option value="Regular">Regular</option>
              <option value="Rolling">Rolling</option>
              <option value="Sponsored">Sponsored</option>
              <option value="Migrated">Migrated</option>
              <option value="Direct">Direct</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="fundingType" className="text-base">
              Funding Type: <span className="text-red-500">*</span>
            </label>
            <select
              id="fundingType"
              name="fundingType"
              value={studentData.fundingType}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-200"
            >
              <option value="">Select Funding Type</option>
              <option value="Institute">Institute</option>
              <option value="Sponsored">Sponsored</option>
              <option value="Others">Others</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="sourceOfFunding" className="text-base">
              Source of Funding:
            </label>
            <input
              type="text"
              id="sourceOfFunding"
              name="sourceOfFunding"
              value={studentData.sourceOfFunding}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="contingencyPoints" className="text-base">
              Contingency Points: <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="contingencyPoints"
              name="contingencyPoints"
              value={studentData.contingencyPoints}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="studentStatus" className="text-base">
              Student Status: <span className="text-red-500">*</span>
            </label>
            <select
              id="studentStatus"
              name="studentStatus"
              value={studentData.studentStatus}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-200"
            >
              <option value="">Select Student Status</option>
              <option value="Active">Active</option>
              <option value="Terminated">Terminated</option>
              <option value="Graduated">Graduated</option>
              <option value="Shifted">Shifted</option>
              <option value="Semester Leave">Semester Leave</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="thesisSubmissionDate" className="text-base">
              Thesis Submission Date:
            </label>
            <input
              type="date"
              id="thesisSubmissionDate"
              name="thesisSubmissionDate"
              value={studentData.thesisSubmissionDate}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="thesisDefenceDate" className="text-base">
              Thesis Defence Date:
            </label>
            <input
              type="date"
              id="thesisDefenceDate"
              name="thesisDefenceDate"
              value={studentData.thesisDefenceDate}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="yearOfLeaving" className="text-base">
              Year of Leaving:
            </label>
            <input
              type="number"
              id="yearOfLeaving"
              name="yearOfLeaving"
              value={studentData.yearOfLeaving}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="comment" className="text-base">
              Comment:
            </label>
            <textarea
              id="comment"
              name="comment"
              value={studentData.comment}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-200"
            ></textarea>
          </div>
        </form>
      </DialogBody>
      <Alert
        open={alertOpen}
        className="max-w-screen-md"
        onClose={handleCloseAlert}
        color="red"
      >
        <Typography variant="h5" color="white">
          Error
        </Typography>
        {error && (
          <div>
            {Object.entries(error).map(([key, messages]) => (
              <div key={key}>
                <Typography color="white">{key}:</Typography>
                <ul>
                  {messages.map((message, index) => (
                    <li key={index}>
                      <Typography color="white">{message}</Typography>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
        {/* Render a generic error message if error is not specifically handled */}
        {!error && (
          <Typography color="white">
            An error occurred. Please try again later.
          </Typography>
        )}
      </Alert>

      <DialogFooter>
        <Button
          color="gray"
          buttonType="filled"
          onClick={handleEditStudent}
          ripple="true"
          disabled={!isAllFieldsFilled} // Disable the button if required fields are not filled
        >
          Edit Student
        </Button>
        <Button color="red" buttonType="link" onClick={onClose} ripple="light">
          Cancel
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

function DeleteStudentForm({ isOpen, onClose, prevData, deleteStudent }) {
  let navigate = useNavigate();
  const handleCancel = () => {
    onClose(); // Close the dialog when Cancel button is clicked
  };

  const handleConfirm = () => {
    console.log("Deleting student...");
    deleteStudent(prevData.rollNumber);
    navigate("/db");

    onClose();
  };
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogHeader>Confirmation</DialogHeader>
      <DialogBody>
        Are you sure you want to delete the student {prevData.name}?
      </DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          color="red"
          onClick={handleCancel}
          className="mr-1"
        >
          <span>Cancel</span>
        </Button>
        <Button variant="gradient" color="green" onClick={handleConfirm}>
          <span>Confirm</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

function StudentProfile() {
  const { id } = useParams();
  const { students, fetchData, deleteStudent } = useContext(StudentContext);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const showDeleteDialog = () => {
    setIsDeleteOpen(true);
  };

  const handleDeleteClose = () => {
    setIsDeleteOpen(false);
  };

  const handleEditOpen = () => {
    setIsEditOpen(true);
  };
  const handleEditClose = () => {
    setIsEditOpen(false);
  };

  const data = students
    ? students.results
      ? students.results.find((student) => student.rollNumber === id)
      : null
    : null;

  useEffect(() => {
    if (students == null) {
      fetchData(undefined, undefined, undefined, setLoading);
    }
    console.log(data);
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
    <div className="flex flex-col  w-full h-full">
      {data ? (
        <div>
          <Card shadow={false}>
            <CardHeader floated={false} shadow={false}>
              <Typography className="ml-5" variant="h3" color="blue-gray">
                Student Details
              </Typography>
            </CardHeader>
            <CardBody className="flex flex-row flex-1">
              <AcademicCapIcon className="size-10 md:size-16 xl:size-20 text-blue-gray-900" />
              <div className="ml-10 h-full flex flex-col flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
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
                  <div className="flex items-center space-x-4">
                    <button
                      className="flex items-center"
                      onClick={handleEditOpen}
                    >
                      <PencilIcon className="h-5 w-5 mr-1 text-blue-500" />
                      <span className="text-blue-500">Edit</span>
                    </button>
                    <button
                      className="flex items-center"
                      onClick={showDeleteDialog}
                    >
                      <TrashIcon className="h-5 w-5 mr-1 text-red-500" />
                      <span className="text-red-500">Delete</span>
                    </button>
                  </div>
                </div>

                <EditStudentForm
                  isOpen={isEditOpen}
                  onClose={handleEditClose}
                  prevData={data}
                />

                <DeleteStudentForm
                  isOpen={isDeleteOpen}
                  onClose={handleDeleteClose}
                  prevData={data}
                  deleteStudent={deleteStudent}
                />

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

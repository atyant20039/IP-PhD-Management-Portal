import React, { useState, useContext, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Alert,
  Typography,
} from "@material-tailwind/react";
import StudentContext from "../context/StudentContext";
import FacultyContext from "../context/FacultyContext";
import Select from "react-select";
import axios from "axios";

function AddStudentForm({ isOpen, onClose }) {
  const { addStudent, error } = useContext(StudentContext);

  const { fetchData, faculty } = useContext(FacultyContext);
  const [facultyOptions, setFacultyOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [alertOpen, setAlertOpen] = useState(false);

  useEffect(() => {
    if (error) {
      console.log("error")
      setAlertOpen(true);
    }

    if (error === null || error === false) {
      console.log("no error")
      onClose()
      setStudentData({
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
        advisor: "null@iiitd.ac.in", // Default email
        advisor2: "null@iiitd.ac.in", // Default email
        coadvisor: "null@iiitd.ac.in", // Default email
      });
    }
   
  }, [error]);

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
    advisor1: "null@iiitd.ac.in", // Default email
    advisor2: "null@iiitd.ac.in", // Default email
    coadvisor: "null@iiitd.ac.in", // Default email
  });

  
  const handleAdvisorChange = (selectedOption, field) => {
    // Remove quotes from field
    field = field.substring(0, field.length );
    console.log(field)
    
    setStudentData((prevData) => ({
      ...prevData,
      [field]: selectedOption.value, // Set the whole selectedOption object
    }));
  
    console.log(studentData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

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

  const handleManualAddStudent = () => {
    console.log("Adding student:", studentData);
    addStudent(studentData);

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
      </Alert>
      <DialogFooter>
        <Button className="mx-2"
          color="gray"
          buttonType="filled"
          onClick={handleManualAddStudent}
          ripple="true"
          disabled={!isAllFieldsFilled} // Disable the button if required fields are not filled
        >
          Add Student
        </Button>
        <Button color="red" buttonType="link" onClick={onClose} ripple={true}>
          Cancel
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

function AddStudent({ setStudentData }) {
  const { addStudentbyFile } = useContext(StudentContext);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const API = import.meta.env.VITE_BACKEND_URL;

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setStudentData(file);
  };

  const downloadTemplate = async () => {
    try {
      const response = await axios.get(`${API}/api/studentTable/`, {
        responseType: "blob", // Treat the response as binary data
      });

      // Create a Blob from the response data
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Create a URL for the Blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary <a> element to trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.download = "student_data.xlsx"; // Set the filename
      document.body.appendChild(link);

      // Programmatically click the link to initiate the download
      link.click();

      // Clean up: Remove the temporary <a> element and revoke the Blob URL
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      // Handle errors
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <div>
          <Button
            color="gray"
            buttonType="filled"
            onClick={() => setIsOpen(true)}
            ripple="light"
          >
            Add Student Manually
          </Button>
        </div>
        <AddStudentForm isOpen={isOpen} onClose={() => setIsOpen(false)} />
        <div className="m-2">
          <div className="relative">
            <input
              variant="outline"
              id="fileInput"
              className="opacity-0 absolute inset-0 z-50"
              type="file"
              accept=".xlsx, .xlsm"
              onChange={handleFileUpload}
            />
            <label
              htmlFor="fileInput"
              className="cursor-pointer py-2 px-8 bg-blue-500 font-semibold text-white text-sm rounded-md hover:bg-blue-600"
            >
              Add Student by File
            </label>
          </div>
          <div
            className="m-2 cursor-pointer text-blue-500 underline"
            onClick={downloadTemplate}
          >
            Download Template
          </div>
          {selectedFile && (
            <div className="mb-4">
              <p className="text-base font-semibold">
                Selected File: {selectedFile.name}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function AddProfessor() {
  return <div>Form to add professor here</div>;
}

function AddMemberDialog({ isOpen, setOpen, member }) {
  const { addStudentbyFile } = useContext(StudentContext);

  const [studentData, setstudentData] = useState([]);

  useEffect(() => {
    console.log(studentData);
  }, [studentData]);

  const handleConfirm = () => {
    if (member === "Student" && studentData) {
      // If member is a student and studentData is available
      addStudentbyFile(studentData); // Add student data to the context
    }
    handleOpen(); // Close the dialog
  };

  const handleOpen = () => {
    setOpen(!isOpen);
  };

  return (
    <Dialog open={isOpen} size="xs" handler={handleOpen}>
      <DialogHeader className=" justify-center ">Add {member}</DialogHeader>
      <DialogBody>
        {member === "Student" ? (
          <AddStudent setStudentData={setstudentData} />
        ) : member === "Professor" ? (
          <AddProfessor />
        ) : null}
      </DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          color="red"
          onClick={handleOpen}
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

export default AddMemberDialog;

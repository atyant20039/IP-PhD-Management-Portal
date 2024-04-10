import React, { useState, useContext, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
} from "@material-tailwind/react";
import StudentContext from "../context/StudentContext";
import FacultyContext from "../context/FacultyContext";
import Select from "react-select";
function AddStudentForm({ isOpen, onClose }) {
  const { addStudent } = useContext(StudentContext);

  const { fetchData, faculty } = useContext(FacultyContext);
  const [facultyOptions, setFacultyOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [studentData, setStudentData] = useState({
    rollNumber: "",
    name: "",
    emailId: "",
    gender: "",
    department: "",
    joiningDate: "",
    batch: "",
    educationalQualification: "",
    region: "",
    admissionThrough: "",
    fundingType: "",
    sourceOfFunding: "",
    contingencyPoints: "",
    studentStatus: "",
    thesisSubmissionDate: "",
    thesisDefenceDate: "",
    yearOfLeaving: "",
    comment: "",
    advisor1_emailId: "null@iiitd.ac.in", // Default email
    advisor2_emailId: "null@iiitd.ac.in", // Default email
    coadvisor_emailId: "null@iiitd.ac.in", // Default email
  });
  
  const handleAdvisorChange = (selectedOption, field) => {
    console.log(field)
    console.log(selectedOption.value)
    // If selectedOption is an object, it means it's coming from a dropdown
    if (selectedOption && selectedOption.value !== undefined) {
      setStudentData(prevData => ({
        ...prevData,
        [field]: selectedOption.value // Set the whole selectedOption object
      }));
    } else { // If selectedOption is not an object, it's coming from a regular input field
      const { name, value } = selectedOption.target;
      setStudentData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(value)
  
    setStudentData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  
  
  
  useEffect(() => {
    const fetchFacultyData = async () => {
      setLoading(true);
      try {
        // Fetch faculty data here
        // Assuming fetchData function accepts a search term and returns faculty data
        fetchData(1, ""); // Empty search term to get all faculty
        console.log(faculty)
        // Format faculty data into options array
        const options = faculty.results.map(advisor => ({
          value: advisor.emailId,
          label: advisor.name
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
    setStudentData({
      rollNumber: "",
      name: "",
      emailId: "",
      gender: "",
      department: "",
      joiningDate: "",
      batch: "",
      educationalQualification: "",
      region: "",
      admissionThrough: "",
      fundingType: "",
      sourceOfFunding: "",
      contingencyPoints: "",
      studentStatus: "",
      thesisSubmissionDate: "",
      thesisDefenceDate: "",
      yearOfLeaving: "",
      comment: "",
      advisor1_emailId: "",
      advisor2_emailId: "",
      coadvisor_emailId: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addStudent(studentData);
    console.log("Form data:", studentData);
    setStudentData({
      rollNumber: "",
      name: "",
      emailId: "",
      gender: "",
      department: "",
      joiningDate: "",
      batch: "",
      educationalQualification: "",
      region: "",
      admissionThrough: "",
      fundingType: "",
      sourceOfFunding: "",
      contingencyPoints: "",
      studentStatus: "",
      thesisSubmissionDate: "",
      thesisDefenceDate: "",
      yearOfLeaving: "",
      comment: "",
      advisor1_emailId: "",
      advisor2_emailId: "",
      coadvisor_emailId: "",
    });
    onClose();
  }

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogHeader>Add Student</DialogHeader>
      <DialogBody className="max-h-96 overflow-y-auto">
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
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
        <label htmlFor="advisor1_emailId" className="text-base">
          Advisor 1 Email ID:
        </label>
        <Select
          id="advisor1_emailId"
          name="advisor1_emailId"
          value={studentData.advisor1_emailId.value}
          onChange={(selectedOption) => handleAdvisorChange(selectedOption, "advisor1_emailId")}
          options={facultyOptions}
          isLoading={loading}
          className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-200"
          placeholder="Select Advisor"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="advisor2_emailId" className="text-base">
          Advisor 2 Email ID:
        </label>
        <Select
          id="advisor2_emailId"
          name="advisor2_emailId"
          value={studentData.advisor2_emailId.value}
          onChange={(selectedOption) => handleAdvisorChange(selectedOption, "advisor2_emailId")}
          options={facultyOptions}
          isLoading={loading}
          className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-200"
          placeholder="Select Advisor"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="coadvisor_emailId" className="text-base">
          Co-advisor Email ID:
        </label>
        <Select
          id="coadvisor_emailId"
          name="coadvisor_emailId"
          value={studentData.coadvisor_emailId.value}
          onChange={(selectedOption) => handleAdvisorChange(selectedOption, "coadvisor_emailId")}
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
              Admission Through:
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
              Funding Type:
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
              Contingency Points:
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
              Student Status:
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
      <DialogFooter>
        <Button
          color="gray"
          buttonType="filled"
          onClick={handleManualAddStudent}
          ripple="true"
        >
          Add Student
        </Button>
        <Button color="red" buttonType="link" onClick={onClose} ripple="light">
          Cancel
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

function AddStudent() {
  const [isOpen, setIsOpen] = useState(false);

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
              accept=".xlsx"
            />
            <label
              htmlFor="fileInput"
              className="cursor-pointer py-2 px-8 bg-blue-500 font-semibold text-white text-sm rounded-md hover:bg-blue-600"
            >
              Add Student by File
            </label>
          </div>
        </div>
      </div>
    </>
  );
}

function AddProfessor() {
  return <div>Form to add professor here</div>;
}

function AddMemberDialog({ isOpen, setOpen, member }) {
  const handleOpen = () => {
    setOpen(!isOpen);
  };
  return (
    <Dialog open={isOpen} size="xs" handler={handleOpen}>
      <DialogHeader className=" justify-center ">Add {member}</DialogHeader>
      <DialogBody>
        {member === "Student" ? (
          <AddStudent />
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
        <Button variant="gradient" color="green" onClick={handleOpen}>
          <span>Confirm</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

export default AddMemberDialog;

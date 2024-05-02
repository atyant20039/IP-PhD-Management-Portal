import React, { useState, useContext, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  CardFooter,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import StudentContext from "../context/StudentContext";

const TABLE_HEAD = [
  "Name",
  "Roll Number",
  "Department",
  "Joining Date",
  "HRA",
  "Comprehensive Exam Date",
  "Base Amount",
  "Hostler",
  "Eligible",
];

function Stipend() {
  const [month, setMonth] = useState(4);
  const [year, setYear] = useState(2023);
  const [searchTerm, setSearchTerm] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const { fetchEligibleStudentList, eligibleStudentList, students,setEligibleStudentList } =useContext(StudentContext);
  const [eligibleStudents, setEligibleStudents] = useState(eligibleStudentList);
  const [ineligibleStudentList, setIneligibleStudentList] = useState(null);
  const [studentList, setStudentList] = useState([]);

  useEffect(() => {
    setEligibleStudents(eligibleStudentList);
    setStudentList(eligibleStudentList);
  }, [eligibleStudentList]);

  useEffect(() => {
    if(searchTerm=== ""){
    setStudentList(eligibleStudents);
    }
  }, [searchTerm]);

  const handleGenerate = async () => {
    if (month && year) {
      await fetchEligibleStudentList({ month, year });
    }
  };
  
  const handleToggleHistory = () => {
    setShowHistory((prevState) => !prevState);
  };

  const NotEligibleStudents = () => {
    if (!students || !eligibleStudentList) return;
  
    const eligibleRollNumbers = eligibleStudentList.map(
      (student) => student.rollNumber
    );
    const notEligibleStudents = students.results
      .filter((student) => !eligibleRollNumbers.includes(student.rollNumber))
      .map((student) => {
        const { comprehensiveExamDate } = student;
        const department = student.department || null;
        const joiningDate = student.joiningDate || null;
        const name = student.name || null;
        const rollNumber = student.rollNumber || null;
  
        // Calculate baseAmount if it's null or not present
        let calculatedBaseAmount = comprehensiveExamDate ? 42000 : 37000;
        // fetch comprehensive data
      
  
        return {
          baseAmount: calculatedBaseAmount,
          comprehensiveExamDate: comprehensiveExamDate || null,
          department,
          eligible: "No",
          hostler: null,
          hra: null,
          joiningDate,
          month: month.toString(),
          name,
          rollNumber,
          year: year.toString(),
        };
      });
  
    setIneligibleStudentList(notEligibleStudents);
    console.log(notEligibleStudents)
  };
  

  const handleFieldChange = (index, fieldName, value) => {
    const updatedStudentList = [...studentList];
    updatedStudentList[index][fieldName] = value;

    if (fieldName === "hostler") {
      const hostlerValue = value.toLowerCase();
      const hraValue = hostlerValue === "no" ? 5000 : 0; 
      updatedStudentList[index]["hra"] = hraValue;
    }

    setStudentList(updatedStudentList);
  };

  useEffect(() => {
    NotEligibleStudents();
  }, [students, eligibleStudentList]);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    if (!term) {
      setStudentList(eligibleStudentList); 
    } else {
      const combinedList = [...eligibleStudents, ...ineligibleStudentList];
      const filteredStudents = combinedList.filter(
        (student) =>
          student.name.toLowerCase().includes(term) ||
          student.rollNumber.toLowerCase().includes(term)
      );
      setStudentList(filteredStudents);
    }
  };

  const handleUpdateEligibility = (rollNumber) => {
    const studentToUpdate = ineligibleStudentList.find(
      (student) => student.rollNumber === rollNumber
    );

    if (studentToUpdate) {
      studentToUpdate.eligible = "Yes";
      const updatedIneligibleStudents = ineligibleStudentList.filter(
        (student) => student.rollNumber !== rollNumber
      );
      setEligibleStudents([...eligibleStudents, studentToUpdate]);
      setIneligibleStudentList(updatedIneligibleStudents);

    }
  };

  const ResetHandler = ()=>{
    setEligibleStudentList(null)
    setStudentList(null)
    setIneligibleStudentList(null)
  }

  const handleSubmit = () =>{
    console.log(studentList)
  }


  return (
    <Card className="h-full w-full">
      {!studentList && (
        <CardHeader floated={false} shadow={false} className="h-auto p-2">
          <div className="flex flex-col items-center gap-2 md:flex-row mx-4">
            <Typography variant="h4"> Enter Month and year to generate Eligibility List :</Typography>
         
            <div>
              <Input
                label="Month"
                type="number"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              />
            </div>
            <div>
              <Input
                label="Year"
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
            <Button onClick={handleGenerate}>Generate</Button>
          </div>
        </CardHeader>
      )}
      {studentList && (
        <>
          <CardHeader
            floated={false}
            shadow={false}
            className="h-24 m-0 sticky top-0 bg-white z-50"
          >
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row mx-2">
              <div>
                <Button onClick={ResetHandler}>
                  Reset Data
                </Button>
              </div>
              <div>
                <Button onClick={handleToggleHistory}>
                  {showHistory ? "Show Current Month Data" : "Show History"}
                </Button>
              </div>
              <div className="w-full">
                <Input
                  label="Search"
                  icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                  onChange={handleSearch}
                />
              </div>
            </div>
          </CardHeader>
          <CardBody className="overflow-scroll max-h-[550px] px-0 py-0">
            <table className="w-full min-w-max table-auto text-left">
              <thead className="sticky top-0 bg-white z-50">
                <tr>
                  {TABLE_HEAD.map((head) => (
                    <th
                      key={head}
                      className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal leading-none opacity-70"
                      >
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {studentList.map(
                  (
                    {
                      name,
                      rollNumber,
                      joiningDate,
                      department,
                      hostler,
                      baseAmount,
                      eligible,
                      hra,
                      comprehensiveExamDate,
                    },
                    index
                  ) => (
                    <tr key={index}>
                      <td className="border-b border-blue-gray-100 bg-white p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {name}
                        </Typography>
                      </td>
                      <td className="border-b border-blue-gray-100 bg-white p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {rollNumber}
                        </Typography>
                      </td>
                      <td className="border-b border-blue-gray-100 bg-white p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {department}
                        </Typography>
                      </td>
                      <td className="border-b border-blue-gray-100 bg-white p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {joiningDate}
                        </Typography>
                      </td>
                      <td className="border-b border-blue-gray-100 bg-white p-4">
                        <Input
                          value={hra}
                          onChange={(e) =>
                            handleFieldChange(index, "hra", e.target.value)
                          }
                        />
                      </td>
                      <td className="border-b border-blue-gray-100 bg-white p-4">
                        <Input
                          value={comprehensiveExamDate}
                          onChange={(e) =>
                            handleFieldChange(
                              index,
                              "comprehensiveExamDate",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td className="border-b border-blue-gray-100 bg-white p-4">
                        <Input
                          value={baseAmount}
                          onChange={(e) =>
                            handleFieldChange(
                              index,
                              "baseAmount",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td className="border-b border-blue-gray-100 bg-white p-4">
                        <Input
                          value={hostler}
                          onChange={(e) =>
                            handleFieldChange(index, "hostler", e.target.value)
                          }
                        />
                      </td>
                      <td className="border-b border-blue-gray-100 bg-white p-4">
                        <Button
                          color={eligible === "Yes" ? "green" : "red"}
                          disabled={eligible === "Yes"}
                          onClick={() => handleUpdateEligibility(rollNumber)}
                        >
                          {eligible}
                        </Button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </CardBody>
          <CardFooter className="p-2">
            <Button variant="outlined" size="sm"
            disabled={searchTerm !==""}  onClick={handleSubmit}> 
              Submit List
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
}

export default Stipend;

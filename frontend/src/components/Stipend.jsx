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
  Checkbox,
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
  "Comprehensive Exam Date",
  "Hostler",
  "HRA",
  "Base Amount",
  "Total Stipend",
  "Eligible",
];

const HISTORY_TABLE_HEAD = [
  "Name",
  "Roll Number",
  "Department",
  "Disbursment Date",
  "Month",
  "Year",
  "Hostler",
  "Base Amount",
  "HRA",
  "Total",
  "Comment",
];

const API = import.meta.env.VITE_BACKEND_URL;

function Stipend() {
  const [month, setMonth] = useState(4);
  const [year, setYear] = useState(2023);
  const [searchTerm, setSearchTerm] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const {
    fetchEligibleStudentList,
    eligibleStudentList,
    students,
    setEligibleStudentList,
  } = useContext(StudentContext);
  const [eligibleStudents, setEligibleStudents] = useState(eligibleStudentList);
  const [ineligibleStudentList, setIneligibleStudentList] = useState(null);
  const [studentList, setStudentList] = useState([]);
  const [stipendHistory, setStipendHistory] = useState([]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showFailedStudentsDialog, setShowFailedStudentsDialog] =
    useState(false);
  const [failedEntries, setFailedEntries] = useState([]);

  useEffect(() => {
    setEligibleStudents(eligibleStudentList);
    setStudentList(eligibleStudentList);
  }, [eligibleStudentList]);

  useEffect(() => {
    if (searchTerm === "") {
      setStudentList(eligibleStudents);
    }
  }, [searchTerm]);

  useEffect(() => {
    NotEligibleStudents();
    fetchStipendHistory();
  }, [students, eligibleStudentList]);

  const fetchStipendHistory = () => {
    fetch(`${API}/api/stipend/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch stipend history");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setStipendHistory(data.results);
      })
      .catch((error) => {
        console.error("Error fetching stipend history:", error);
      });
  };

  const handleCloseFailedStudentsDialog = () => {
    setShowFailedStudentsDialog(false);
  };
  const handleGenerate = async () => {
    if (month && year) {
      await fetchEligibleStudentList({ month, year });
    }
  };
  const handleToggleHistory = () => {
    setShowHistory((prevState) => !prevState);
    if (!showHistory) {
      // If toggling to show history, set studentList to stipendHistory
      setStudentList(stipendHistory);
    } else {
      // If toggling back to current student list, set studentList based on term search
      if (searchTerm === "") {
        // If no search term, set studentList to eligibleStudentList
        setStudentList(eligibleStudents);
      } else {
        // If search term exists, combine eligibleStudents and ineligibleStudentList based on the term
        const combinedList = [...eligibleStudents, ...ineligibleStudentList];
        const filteredStudents = combinedList.filter(
          (student) =>
            student.name.toLowerCase().includes(searchTerm) ||
            student.rollNumber.toLowerCase().includes(searchTerm)
        );
        setStudentList(filteredStudents);
      }
    }
  };

  const NotEligibleStudents = async () => {
    if (!students || !eligibleStudentList) return;

    try {
      // Fetch comprehensive reviews
      const comprehensiveResponse = await fetch(`${API}/api/comprehensive`);
      const comprehensiveData = await comprehensiveResponse.json();

      // Map IDs to date of review
      const idToDateOfReviewMap = {};
      comprehensiveData.results.forEach((review) => {
        idToDateOfReviewMap[review.id] = review.dateOfReview;
      });

      // Map comprehensive review ID to date of review for each student
      const notEligibleStudents = students.results.map((student) => {
        const dateOfReview =
          student.id in idToDateOfReviewMap
            ? idToDateOfReviewMap[student.id]
            : null;

        const baseAmount = dateOfReview ? 42000 : 37000;

        return {
          baseAmount: baseAmount,
          comprehensiveExamDate: dateOfReview,
          department: student.department,
          eligible: "No",
          hostler: "YES",
          hra: 0,
          id: student.id,
          joiningDate: student.joiningDate,
          month: "4",
          name: student.name,
          rollNumber: student.rollNumber,
          year: "2023",
        };
      });

      setIneligibleStudentList(notEligibleStudents);
      console.log(notEligibleStudents);
    } catch (error) {
      console.error("Error fetching comprehensive reviews:", error);
    }
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
  const ResetHandler = () => {
    setEligibleStudentList(null);
    setStudentList(null);
    setIneligibleStudentList(null);
  };
  const handleSubmit = () => {
    const modifiedStudentList = studentList.map(({ eligible, ...rest }) => ({
      student: rest.id,
      ...rest,
    }));
    console.log(modifiedStudentList);
    fetch(`${API}/api/stipend/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(modifiedStudentList),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Response from server:", data);
        const { successful_entries, failed_entries } = data;

        if (failed_entries.length === 0) {
          setShowSuccessDialog(true);
          ResetHandler();
        } else {
          setShowFailedStudentsDialog(true);
          setFailedEntries(failed_entries);
          console.log("Failed entries:", failed_entries);
          ResetHandler();
        }
      })
      .catch((error) => {
        console.error("Error sending data:", error);
      });
  };
  const handleCloseSuccessDialog = () => {
    setShowSuccessDialog(false);
  };

  const handleDeleteEntry = (rollNumber) => {
    const updatedStudentList = studentList.filter(
      (student) => student.rollNumber !== rollNumber
    );
    setStudentList(updatedStudentList);
  };

  return (
    <Card className="h-full w-full">
      {!studentList && (
        <CardHeader floated={false} shadow={false} className="h-auto p-2">
          <div className="flex flex-col items-center gap-2 md:flex-row mx-4">
            <Typography variant="h4">
              {" "}
              Enter Month and year to generate Eligibility List :
            </Typography>

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
              {!showHistory && (
                <div>
                  <Button onClick={ResetHandler}>Reset Data</Button>
                </div>
              )}
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
                  {showHistory
                    ? HISTORY_TABLE_HEAD.map((head) => (
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
                      ))
                    : TABLE_HEAD.map((head) => (
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
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {comprehensiveExamDate
                            ? comprehensiveExamDate
                            : "Null"}
                        </Typography>
                      </td>

                      <td className="border-b border-blue-gray-100 bg-white p-4">
                        <div className="flex items-center">
                          <Checkbox
                            checked={hostler === "YES"}
                            color="blue"
                            onChange={() =>
                              handleFieldChange(
                                index,
                                "hostler",
                                hostler === "YES" ? "NO" : "YES"
                              )
                            }
                          />
                        </div>
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
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {parseInt(hra) + parseInt(baseAmount)}
                        </Typography>
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
                      <td className="border-b border-blue-gray-100 bg-white p-4">
                        {!searchTerm && (
                          <Button
                            onClick={() => handleDeleteEntry(rollNumber)}
                            color="red"
                            size="sm"
                          >
                            Delete
                          </Button>
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </CardBody>
          {!showHistory && (
            <CardFooter className="p-2">
              <Button
                variant="outlined"
                size="sm"
                disabled={searchTerm !== ""}
                onClick={handleSubmit}
              >
                Submit List
              </Button>
            </CardFooter>
          )}
        </>
      )}

      <Dialog open={showSuccessDialog} handler={handleCloseSuccessDialog}>
        <DialogHeader>Data Added Successfully</DialogHeader>
        <DialogFooter className="flex justify-end">
          <Button onClick={handleCloseSuccessDialog} color="blue">
            Close
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog
        open={showFailedStudentsDialog}
        onClose={handleCloseFailedStudentsDialog}
        size="lg"
      >
        <DialogHeader color="red">Failed Entries</DialogHeader>
        <DialogBody>
          {failedEntries.map((entry, index) => (
            <div key={index} className="mb-4">
              <Typography variant="body" color="blue-gray">
                <span className="font-semibold">Entry failed for:</span>{" "}
                {entry.studentName} ({entry.studentRollNumber})
              </Typography>
              <Typography variant="body" color="blue-gray">
                <span className="font-semibold">Reason:</span> {entry.reason}
              </Typography>
            </div>
          ))}
        </DialogBody>
        <DialogFooter>
          <Button color="red" onClick={handleCloseFailedStudentsDialog}>
            Close
          </Button>
        </DialogFooter>
      </Dialog>
    </Card>
  );
}

export default Stipend;

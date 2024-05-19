import React, { useContext, useEffect, useState } from "react";
import * as XLSX from "xlsx";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Typography,
} from "@material-tailwind/react";
import { saveAs } from "file-saver";
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
  "HRA",
  "Base Amount",
  "Total Stipend",
  "Comment",
];

const API = import.meta.env.VITE_BACKEND_URL;

function Stipend() {
  const {
    fetchEligibleStudentList,
    eligibleStudentList,
    students,
    setEligibleStudentList,
  } = useContext(StudentContext);

  const [month, setMonth] = useState();
  const [year, setYear] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [eligibleStudents, setEligibleStudents] = useState(eligibleStudentList);
  const [ineligibleStudentList, setIneligibleStudentList] = useState(null);
  const [studentList, setStudentList] = useState([]);
  const [stipendHistory, setStipendHistory] = useState([]);
  const [failedEntries, setFailedEntries] = useState([]);
  //Filter States
  const [filterMonth, setFilterMonth] = useState();
  const [filterYear, setFilterYear] = useState();
  const [department, setDepartment] = useState("");
  // Dialog states
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showFailedStudentsDialog, setShowFailedStudentsDialog] =
    useState(false);
  const departments = ["CSE", "CB", "ECE", "HCD", "SSH", "MATHS"];

  useEffect(() => {
    if (searchTerm === "") {
      if (showHistory) {
        // setStudentList(stipendHistory);
      } else {
        setStudentList(eligibleStudents);
      }
    }
  }, [searchTerm]);

  useEffect(() => {
    NotEligibleStudents();
    fetchStipendHistory();
  }, [students, eligibleStudentList]);

  useEffect(() => {
    console.log("also in");
    // setStudentList(stipendHistory);
  }, [stipendHistory]);

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
        setStipendHistory(data);
      })
      .catch((error) => {
        console.error("Error fetching stipend history:", error);
      });
  };

  const handleGenerate = async () => {
    if (month && year) {
      await fetchEligibleStudentList({ month, year });
    }
    console.log(eligibleStudentList);

    setEligibleStudents(eligibleStudentList || []);
    setStudentList(eligibleStudentList || []);
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
      setStudentList(showHistory ? stipendHistory : eligibleStudents);
    } else {
      if (showHistory) {
        const filteredHistory = stipendHistory.filter(
          (student) =>
            student.name.toLowerCase().includes(term) ||
            student.rollNumber.toLowerCase().includes(term)
        );
        setStudentList(filteredHistory);
      } else {
        const combinedList = [...eligibleStudents, ...ineligibleStudentList];
        const filteredCurrent = combinedList.filter(
          (student) =>
            student.name.toLowerCase().includes(term) ||
            student.rollNumber.toLowerCase().includes(term)
        );
        setStudentList(filteredCurrent);
      }
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

  const handleDownload = () => {
    if (studentList) {
      const worksheet = XLSX.utils.json_to_sheet(studentList);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      saveAs(
        new Blob([excelBuffer], { type: "application/octet-stream" }),
        "student_list.xlsx"
      );
    }
  };

  const handleFilterClick = () => {
    setShowFilterDialog(true);
  };

  const handleCloseFailedStudentsDialog = () => {
    setShowFailedStudentsDialog(false);
  };

  const handleFilterSubmit = () => {
    const filteredHistory = stipendHistory.filter((student) => {
      const isDepartmentMatch =
        !department ||
        student.department.toLowerCase() === department.toLowerCase();

      const isMonthMatch =
        !filterMonth ||
        parseInt(student.month, 10) === parseInt(filterMonth, 10);

      const isYearMatch =
        !filterYear || parseInt(student.year, 10) === parseInt(filterYear, 10);

      return isDepartmentMatch && isMonthMatch && isYearMatch;
    });

    setStudentList(filteredHistory);
    setShowFilterDialog(false);
  };

  const handleFilterReset = () => {
    setFilterMonth("");
    setFilterYear("");
    setDepartment("");
    setStudentList(stipendHistory); // Reset to the original stipendHistory data
  };

  // Use this function to initially load the stipendHistory data or when it changes

  return (
    <div className="h-full w-full">
      {!studentList && (
        <Card className="h-full w-full">
          <CardHeader floated={false} shadow={false} className="h-auto p-2">
            <div className="flex flex-col items-center gap-4">
              <Typography variant="h4">
                Enter Month and Year to generate Stipend Eligibility List
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
              <Button
                onClick={handleGenerate}
                disabled={
                  month == null || month == "" || year == null || year == ""
                }
              >
                Generate
              </Button>
            </div>
          </CardHeader>
        </Card>
      )}
      {studentList && (
        <Card className="h-full w-full flex flex-1" shadow={false}>
          <CardHeader floated={false} shadow={false} className="mx-0 my-2">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mx-2">
              <div className="flex-1">
                <Input
                  label="Search"
                  icon={<MagnifyingGlassIcon className="size-5" />}
                  onChange={handleSearch}
                />
              </div>
              <div className="flex-1 md:flex-none">
                <Button variant="outlined" onClick={handleToggleHistory}>
                  {showHistory ? "Show Current Data" : "Show History"}
                </Button>
              </div>
              {showHistory && (
                <div className="flex-1 md:flex-none">
                  <Button variant="outlined" onClick={handleFilterClick}>
                    Filter
                  </Button>
                </div>
              )}
              <div className="flex-1 md:flex-none">
                <Button onClick={!showHistory ? ResetHandler : handleDownload}>
                  {!showHistory ? "Reset Data" : "Download"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardBody className="overflow-auto p-0 flex-1">
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
                      disbursmentDate,
                      comment,
                      month,
                      year,
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
                          {showHistory ? disbursmentDate : joiningDate}
                        </Typography>
                      </td>

                      {showHistory ? (
                        <>
                          <td className="border-b border-blue-gray-100 bg-white p-4">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {month}
                            </Typography>
                          </td>
                          <td className="border-b border-blue-gray-100 bg-white p-4">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {year}
                            </Typography>
                          </td>
                        </>
                      ) : (
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
                      )}

                      <td className="border-b border-blue-gray-100 bg-white p-4">
                        <div className="flex items-center">
                          <Checkbox
                            checked={hostler === "YES"}
                            disabled={showHistory}
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
                        {showHistory ? (
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {hra}
                          </Typography>
                        ) : (
                          <Input
                            value={hra}
                            onChange={(e) =>
                              handleFieldChange(index, "hra", e.target.value)
                            }
                          />
                        )}
                      </td>

                      <td className="border-b border-blue-gray-100 bg-white p-4">
                        {showHistory ? (
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {baseAmount}
                          </Typography>
                        ) : (
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
                        )}
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

                      {showHistory ? (
                        <td className="border-b border-blue-gray-100 bg-white p-4">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {comment ? comment : "NO COMMENT"}
                          </Typography>
                        </td>
                      ) : (
                        <td className="border-b border-blue-gray-100 bg-white p-4">
                          <Button
                            color={eligible === "Yes" ? "green" : "red"}
                            disabled={eligible === "Yes"}
                            onClick={() => handleUpdateEligibility(rollNumber)}
                          >
                            {eligible}
                          </Button>
                        </td>
                      )}

                      {!showHistory && (
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
                      )}
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </CardBody>
          {!showHistory && (
            <CardFooter className="p-2 flex flex-col items-end">
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
        </Card>
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

      <Dialog
        open={showFilterDialog}
        onClose={() => setShowFilterDialog(false)}
      >
        <DialogHeader>Filter</DialogHeader>
        <DialogBody>
          <div className="flex flex-col space-y-4">
            <label htmlFor="month">Month:</label>
            <Input
              id="month"
              type="number"
              value={filterMonth}
              onChange={(e) => {
                const monthValue = parseInt(e.target.value, 10);
                if (!isNaN(monthValue) && monthValue >= 1 && monthValue <= 12) {
                  setFilterMonth(monthValue);
                } else if (e.target.value === "" || e.target.value === null) {
                  // Allow deletion if the input is empty or null
                  setFilterMonth("");
                }
              }}
            />

            <label htmlFor="year">Year:</label>
            <Input
              id="year"
              type="number"
              value={filterYear}
              onChange={(e) => {
                const yearValue = e.target.value.trim();
                if (/^\d*$/.test(yearValue) && yearValue.length <= 4) {
                  setFilterYear(yearValue);
                } else if (yearValue === "" || yearValue === null) {
                  // Allow deletion if the input is empty or null
                  setFilterYear("");
                }
              }}
            />

            <label htmlFor="department">Department:</label>
            <select
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button onClick={() => setShowFilterDialog(false)}>Cancel</Button>
          <Button onClick={handleFilterReset}>Reset</Button>
          <Button onClick={handleFilterSubmit}>Apply</Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default Stipend;

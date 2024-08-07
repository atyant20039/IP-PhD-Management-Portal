import React, { useContext, useEffect, useState } from "react";
import * as XLSX from "xlsx";

import { MagnifyingGlassIcon, XCircleIcon } from "@heroicons/react/24/outline";
import {
  Alert,
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
  "Comment",
  "Eligible",
  "",
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
  "",
];

const API = import.meta.env.VITE_BACKEND_URL;

function Stipend() {
  const {
    fetchEligibleStudentList,
    eligibleStudentList,
    allStudents,
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

  const [alert, setAlert] = useState({ show: false, name: null, color: null });

  useEffect(() => {
    if (searchTerm === "") {
      if (showHistory) {
        setStudentList(stipendHistory);
      } else {
        setStudentList(eligibleStudents);
      }
    }
  }, [searchTerm]);

  useEffect(() => {
    if (allStudents && eligibleStudentList) {
      NotEligibleStudents();
      fetchStipendHistory();
    }
  }, [allStudents, eligibleStudentList]);

  useEffect(() => {
    fetchStipendHistory();
  }, []);

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
      const studentsWithEligibility = await fetchEligibleStudentList({
        month,
        year,
      });
      console.log(studentsWithEligibility);

      setEligibleStudents(studentsWithEligibility);
      setStudentList(studentsWithEligibility);
    } else {
      setEligibleStudents([]);
      setStudentList([]);
    }
  };

  const handleToggleHistory = () => {
    fetchStipendHistory();
    setShowHistory((prevState) => !prevState);

    if (!showHistory) {
      // Toggling to history data
      if (searchTerm === "") {
        // If no search term, show all stipend history
        setStudentList(stipendHistory);
      } else {
        // If there's a search term, filter the stipend history
        const filteredHistory = stipendHistory.filter(
          (student) =>
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setStudentList(filteredHistory);
      }
    } else {
      // Toggling back to non-history data
      if (searchTerm === "") {
        // If no search term, show all eligible students
        setStudentList(eligibleStudents);
      } else {
        // If there's a search term, filter the combined list of eligible and ineligible students
        const combinedList = [...eligibleStudents, ...ineligibleStudentList];
        const filteredStudents = combinedList.filter(
          (student) =>
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setStudentList(filteredStudents);
      }
    }
  };

  const NotEligibleStudents = async () => {
    if (!allStudents.length || !eligibleStudentList.length) return;

    try {
      const comprehensiveResponse = await fetch(`${API}/api/comprehensive`);

      if (!comprehensiveResponse.ok)
        throw new Error("Failed to fetch comprehensive reviews");

      const comprehensiveData = await comprehensiveResponse.json();

      console.log(comprehensiveData);
      const idToDateOfReviewMap = {};
      comprehensiveData.forEach((review) => {
        idToDateOfReviewMap[review.id] = review.dateOfReview;
      });

      const notEligibleStudents = allStudents
        .filter(
          (student) =>
            !eligibleStudentList.some((eligible) => eligible.id === student.id)
        )
        .map((student) => {
          const dateOfReview = idToDateOfReviewMap[student.id] || null;
          const baseAmount = dateOfReview ? 42000 : 37000;

          return {
            baseAmount,
            comprehensiveExamDate: dateOfReview,
            department: student.department,
            eligible: "No",
            hostler: "YES",
            hra: 0,
            id: student.id,
            joiningDate: student.joiningDate,
            month: "4", // need to change
            name: student.name,
            rollNumber: student.rollNumber,
            year: "2023", // need to change
            comment: "",
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
    const sanitizedValue = value === "" ? 0 : value;

    updatedStudentList[index][fieldName] = sanitizedValue;

    if (fieldName === "hostler") {
      const hostlerValue = sanitizedValue.toLowerCase();
      const hraValue = hostlerValue === "no" ? 5000 : 0;
      updatedStudentList[index]["hra"] = hraValue;
    }

    setStudentList(updatedStudentList);
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    const applyFilters = (student) => {
      const isYearMatch =
        !filterYear || parseInt(student.year, 10) === parseInt(filterYear, 10);

        const isMonthMatch =
        !filterMonth || parseInt(student.month, 10) === parseInt(filterMonth, 10);

      const isDepartmentMatch =
        !department ||
        student.department.toLowerCase() === department.toLowerCase();
  
      return isYearMatch && isDepartmentMatch && isMonthMatch; 
    };
  

    if (!term) {
      setStudentList(showHistory ? stipendHistory : eligibleStudents);
    } else {
      if (showHistory) {
        const filteredHistory = stipendHistory
        .filter(applyFilters)
        .filter(
          (student) =>
            student.name.toLowerCase().includes(term) ||
            student.rollNumber.toLowerCase().includes(term)
        );
        setStudentList(filteredHistory);
      } else {
        const combinedList = [...eligibleStudents, ...ineligibleStudentList];
        const filteredCurrent = combinedList
        .filter(applyFilters)
        .filter(
          (student) =>
            student.name.toLowerCase().includes(term) ||
            student.rollNumber.toLowerCase().includes(term)
        );
        setStudentList(filteredCurrent);
      }
    }
  };

  const handleUpdateEligibility = (rollNumber, name) => {
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
      showAlert(`${name} is now eligible.`, "green");
    }
  };

  const ResetHandler = () => {
    setEligibleStudentList(null);
    setStudentList(null);
    setIneligibleStudentList(null);
  };

  const handleSubmit = () => {
    setEligibleStudents(null);
    fetchStipendHistory();
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

  const handleDeleteEntry = (rollNumber, name) => {
    console.log("in");
    const updatedStudentList = studentList.filter(
      (student) => student.rollNumber !== rollNumber
    );
    setStudentList(updatedStudentList);
    showAlert(`${name} has been deleted.`, "red");
  };

  const handleDeleteHistory = async (id, name) => {
    try {
      const response = await fetch(`${API}/api/stipend/${id}/`, {
        method: "DELETE",
      });

      if (response.ok) {
        // If the response is ok, update the student list
        const updatedStudentList = studentList.filter(
          (student) => student.id !== id
        );
        setStudentList(updatedStudentList);
        showAlert(`${name} has been deleted.`, "red");
      } else {
        // If the response is not ok, show an error alert
        showAlert(`Failed to delete ${name}.`, "red");
      }
    } catch (error) {
      // If there is an error, show an error alert
      showAlert(`An error occurred: ${error.message}`, "red");
    }
  };

  const showAlert = (name, color) => {
    setAlert({ show: true, name, color });
    setTimeout(() => {
      setAlert({ show: false, name: null, color: null });
    }, 2000);
  };
  const handleDownloadEligibility = () => {
    if (studentList) {
      const fieldOrder = [
        "name",
        "rollNumber",
        "department",
        "joiningDate",
        "comprehensiveExamDate",
        "hostler",
        "hra",
        "baseAmount",
        "total_stipend",
        "comment",
        "eligible",
      ];

      const modifiedStudentList = studentList.map((student) => {
        const modifiedStudent = {};
        fieldOrder.forEach((field, index) => {
          if (field === "total_stipend") {
            // Parse hra and baseAmount as integers before addition
            const hra = parseInt(student["hra"]) || 0;
            const baseAmount = parseInt(student["baseAmount"]) || 0;
            // Calculate total_stipend as the sum of hra and baseAmount
            modifiedStudent[field] = hra + baseAmount;
          } else {
            modifiedStudent[field] = student[field] || ""; // Set empty string if the field doesn't exist
          }
        });
        return modifiedStudent;
      });

      const worksheet = XLSX.utils.json_to_sheet(modifiedStudentList, {
        header: fieldOrder,
      });

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const fileName = `eligibleStudent_${month}_${year}.xlsx`;

      saveAs(
        new Blob([excelBuffer], { type: "application/octet-stream" }),
        fileName
      );
    }
  };

  const handleDownloadStipendHistory = () => {
    if (studentList) {
      const fieldOrder = [
        "name",
        "rollNumber",
        "department",
        "disbursmentDate",
        "month",
        "year",
        "hostler",
        "hra",
        "baseAmount",
        "total_stipend",
        "comment",
        "eligible",
      ];

      const modifiedStudentList = studentList.map((student) => {
        const modifiedStudent = {};
        fieldOrder.forEach((field, index) => {
          if (field === "total_stipend") {
            // Parse hra and baseAmount as integers before addition
            const hra = parseInt(student["hra"]) || 0;
            const baseAmount = parseInt(student["baseAmount"]) || 0;
            // Calculate total_stipend as the sum of hra and baseAmount
            modifiedStudent[field] = hra + baseAmount;
          } else {
            modifiedStudent[field] = student[field] || ""; // Set empty string if the field doesn't exist
          }
        });
        return modifiedStudent;
      });

      const worksheet = XLSX.utils.json_to_sheet(modifiedStudentList, {
        header: fieldOrder,
      });

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const fileName = `StipendHistory.xlsx`;

      saveAs(
        new Blob([excelBuffer], { type: "application/octet-stream" }),
        fileName
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
    const term = searchTerm.toLowerCase();
  
    const filteredHistory = stipendHistory.filter((student) => {
      const isDepartmentMatch =
        !department ||
        student.department.toLowerCase() === department.toLowerCase();
  
      const isMonthMatch =
        !filterMonth ||
        parseInt(student.month, 10) === parseInt(filterMonth, 10);
  
      const isYearMatch =
        !filterYear || parseInt(student.year, 10) === parseInt(filterYear, 10);
  
      const isSearchTermMatch =
        !term ||
        student.name.toLowerCase().includes(term) ||
        student.rollNumber.toLowerCase().includes(term);
  
      return isDepartmentMatch && isMonthMatch && isYearMatch && isSearchTermMatch;
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

  return (
    <div className="h-full w-full">
      {alert.show && (
        <div className="fixed top-4 right-4 z-50">
          <Alert color={alert.color}>{alert.name} </Alert>
        </div>
      )}

      {!studentList && (
        <Card className="h-full w-full">
          <CardHeader floated={false} shadow={false} className="h-auto p-2">
            <div className="flex flex-col items-center gap-4">
              <Typography variant="h4">
                Enter Month and Year to generate Stipend Eligibility List
              </Typography>

              <div>
                <select
                  id="month"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="">Select Month</option>
                  <option value="1">January</option>
                  <option value="2">February</option>
                  <option value="3">March</option>
                  <option value="4">April</option>
                  <option value="5">May</option>
                  <option value="6">June</option>
                  <option value="7">July</option>
                  <option value="8">August</option>
                  <option value="9">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
              </div>
              <div>
                <Input
                  label="Year"
                  type="number"
                  value={year}
                  onWheel={(e) => e.target.blur()}
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

              <Button onClick={handleToggleHistory}>Show History</Button>
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
                <Button
                  onClick={
                    !showHistory ? ResetHandler : handleDownloadStipendHistory
                  }
                >
                  {!showHistory ? "Reset Data" : "Download"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardBody className="overflow-auto p-0 flex-1">
            {studentList.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <XCircleIcon className="h-48 w-48 text-red-500" />
                <Typography variant="h3" className="cursor-default mt-4">
                  No Data Found
                </Typography>
              </div>
            ) : (
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
                        id,
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
                              type="number"
                              onWheel={(e) => e.target.blur()}
                              onChange={(e) =>
                                handleFieldChange(index, "hra", e.target.value)
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
                            {baseAmount}
                          </Typography>
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
                              {comment ? comment : "-"}
                            </Typography>
                          </td>
                        ) : (
                          <>
                            {" "}
                            <td className="border-b border-blue-gray-100 bg-white p-4">
                              <Input
                                value={comment}
                                type="string"
                                onChange={(e) =>
                                  handleFieldChange(
                                    index,
                                    "comment",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td className="border-b border-blue-gray-100 bg-white p-4">
                              <Button
                                color={eligible === "Yes" ? "green" : "red"}
                                disabled={eligible === "Yes"}
                                onClick={() =>
                                  handleUpdateEligibility(rollNumber, name)
                                }
                              >
                                {eligible}
                              </Button>
                            </td>
                          </>
                        )}

                        <td className="border-b border-blue-gray-100 bg-white p-4">
                          <Button
                            onClick={() => {
                              if (showHistory) {
                                handleDeleteHistory(id, name);
                              } else {
                                handleDeleteEntry(rollNumber, name);
                              }
                            }}
                            color="red"
                            size="sm"
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            )}
          </CardBody>
          {!showHistory && (
            <CardFooter className="p-2 flex flex-col items-end">
              <div>
                <Button
                  size="sm"
                  disabled={searchTerm !== ""}
                  onClick={handleDownloadEligibility}
                  className="mx-2"
                >
                  Download
                </Button>
                <Button
                  variant="outlined"
                  size="sm"
                  disabled={searchTerm !== ""}
                  onClick={handleSubmit}
                >
                  Submit List
                </Button>{" "}
              </div>
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
            <select
              id="month"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
            >
              <option value="">Select a month</option>
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>

            <label htmlFor="year">Year:</label>
            <Input
              id="year"
              type="number"
              value={filterYear}
              onWheel={(e) => e.target.blur()}
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
          <div className="flex  ">
            <Button className="mx-1" onClick={handleFilterReset}>
              Reset
            </Button>
            <Button
              className="mx-1"
              color="red"
              onClick={() => setShowFilterDialog(false)}
            >
              Cancel
            </Button>

            <Button className="mx-1" color="green" onClick={handleFilterSubmit}>
              Apply
            </Button>
          </div>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default Stipend;

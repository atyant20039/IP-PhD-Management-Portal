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
  "Year",
  "Amount",
  "Comment",
  "Eligible",
  "",
];

const HISTORY_TABLE_HEAD = [
  "Name",
  "Roll Number",
  "Department",
  "Disbursment Date",
  "Year",
  "Amount",
  "Comment",
  "",
];

const API = import.meta.env.VITE_BACKEND_URL;

function ContingencyPoint() {
  const {
    setContingencyEligible,
    contingencyEligible,
    fetchContigencyEligibleStudentList,
    allStudents,
    setEligibleStudentList,
  } = useContext(StudentContext);

  const [year, setYear] = useState(2023);
  const [searchTerm, setSearchTerm] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [eligibleStudents, setEligibleStudents] = useState(contingencyEligible);
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
    if (allStudents && contingencyEligible) {
      NotEligibleStudents();
      fetchContingencyHistory();
    }
  }, [allStudents, contingencyEligible]);

  useEffect(() => {
    fetchContingencyHistory();
  }, []);

  const fetchContingencyHistory = () => {
    fetch(`${API}/api/contingency/`)
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
        console.error("Error fetching Contingency history:", error);
      });
  };

  const handleGenerate = async () => {
    if (year) {
      const studentsWithEligibility = await fetchContigencyEligibleStudentList({
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
    fetchContingencyHistory();
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
    if (!allStudents.length || !contingencyEligible.length) return;

    try {
      const notEligibleStudents = allStudents
        .filter(
          (student) =>
            !contingencyEligible.some((eligible) => eligible.id === student.id)
        )
        .map((student) => {
          return {
            amount: "20000",
            department: student.department,
            eligible: "No",

            id: student.id,
            joiningDate: student.joiningDate,

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

  const handleUpdateEligibility = (rollNumber, name) => {
    const studentToUpdate = ineligibleStudentList.find(
      (student) => student.rollNumber === rollNumber
    );

    // console.log(studentToUpdate.eligible)

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
    fetchContingencyHistory();
    const currentDate = new Date();

    // Format the date as YYYY-MM-DD
    const formattedDate = currentDate.toISOString().split("T")[0];

    const modifiedStudentList = studentList.map(({ eligible, ...rest }) => ({
      student: rest.id,
      disbursementDate: formattedDate,
      ...rest,
    }));
    console.log(modifiedStudentList);
    fetch(`${API}/api/contingency/`, {
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

  const handleDeleteEntry = (id, name) => {
    const updatedStudentList = studentList.filter(
      (student) => student.id !== id
    );
    setStudentList(updatedStudentList);
    showAlert(`${name} has been deleted.`, "red");
  };

  const handleDeleteHistory = async (id, name) => {
    try {
      const response = await fetch(`${API}/api/contingency/${id}/`, {
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
        "year",
        "amount",
        "comment",
        "eligible",
      ];

      const modifiedStudentList = studentList.map((student) => {
        const modifiedStudent = {};
        fieldOrder.forEach((field, index) => {
          modifiedStudent[field] = student[field] || ""; // Set empty string if the field doesn't exist
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

      const fileName = `ContingencyEligibleStudent_${year}.xlsx`;

      saveAs(
        new Blob([excelBuffer], { type: "application/octet-stream" }),
        fileName
      );
    }
  };

  const handleDownloadContingencyHistory = () => {
    if (studentList) {
      const fieldOrder = [
        "name",
        "rollNumber",
        "department",
        "disbursmentDate",

        "year",

        "amount",
        "comment",
      ];

      const modifiedStudentList = studentList.map((student) => {
        const modifiedStudent = {};
        fieldOrder.forEach((field, index) => {
          modifiedStudent[field] = student[field] || ""; // Set empty string if the field doesn't exist
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

      const fileName = `ContingencyHistory.xlsx`;

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
    setFilterYear("");
    setDepartment("");
    setStudentList(stipendHistory); // Reset to the original stipendHistory data
  };

  return (
    <div className="h-full w-full">
      {alert.show && (
        <div className="fixed top-4 right-4 z-100">
          <Alert color={alert.color}>{alert.name}</Alert>
        </div>
      )}

      {!studentList && (
        <Card className="h-full w-full">
          <CardHeader floated={false} shadow={false} className="h-auto p-2">
            <div className="flex flex-col items-center gap-4">
              <Typography variant="h4">
                Enter Year to generate Contingency Eligibility List
              </Typography>

              <div>
                <Input
                  label="Year"
                  type="number"
                  onWheel={(e) => e.target.blur()}
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
              </div>
              <Button
                onClick={handleGenerate}
                disabled={year == null || year == ""}
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
                    !showHistory
                      ? ResetHandler
                      : handleDownloadContingencyHistory
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
                        amount,
                        eligible,
                        disbursmentDate,
                        comment,
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
                        <td className="border-b border-blue-gray-100 bg-white p-4">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {year}
                          </Typography>
                        </td>

                        <td className="border-b border-blue-gray-100 bg-white p-4">
                          {showHistory ? (
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {amount}
                            </Typography>
                          ) : (
                            <Input
                              value={amount}
                              type="number"
                              onWheel={(e) => e.target.blur()}
                              onChange={(e) =>
                                handleFieldChange(
                                  index,
                                  "amount",
                                  e.target.value
                                )
                              }
                            />
                          )}
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
                                handleDeleteEntry(id, name);
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

export default ContingencyPoint;

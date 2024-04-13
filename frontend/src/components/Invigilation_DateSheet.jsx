import React, { useState } from "react";
import {
  Button,
  Input,
  Card,
  Typography,
  Tooltip,
  IconButton,
  CardHeader,
  CardBody,
} from "@material-tailwind/react";

import { format } from "date-fns";
import {
  ChevronUpDownIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
  BookmarkIcon
} from "@heroicons/react/24/solid";

const TABLE_HEAD = [
  {
    head: "Date",
    value: "date",
  },
  {
    head: "Day",
    value: "day",
  },
  {
    head: "Start Time",
    value: "startTime",
  },
  {
    head: "End Time",
    value: "endTime",
  },
  {
    head: "Acronym",
    value: "acronym",
  },
  {
    head: "Course Code",
    value: "courseCode",
  },
  {
    head: "Strength",
    value: "strength",
  },
  {
    head: "Venue",
    value: "venue",
  },
  {
    head: "Room No.",
    value: "roomNo",
  },
];

function Datesheet({onSubmit}) {
  const [tableData, setTableData] = useState([
    {
      id: 1,
      date: "2/24/2024",
      day: "Saturday",
      startTime: "10:00 AM",
      endTime: "11:00 AM",
      acronym: "BDMH",
      courseCode: "BIO543",
      strength: 127,
      venue: "LHC",
      roomNo: "C101",
    },
    {
      id: 2,
      date: "3/1/2024",
      day: "Thursday",
      startTime: "9:00 AM",
      endTime: "10:00 AM",
      acronym: "PHYS",
      courseCode: "PHY101",
      strength: 85,
      venue: "SCI",
      roomNo: "A201",
    },
    {
      id: 3,
      date: "3/5/2024",
      day: "Monday",
      startTime: "11:00 AM",
      endTime: "12:00 PM",
      acronym: "CHEM",
      courseCode: "CHEM202",
      strength: 95,
      venue: "LAB",
      roomNo: "L102",
    },
    {
      id: 4,
      date: "3/10/2024",
      day: "Saturday",
      startTime: "2:00 PM",
      endTime: "3:00 PM",
      acronym: "MATH",
      courseCode: "MATH301",
      strength: 70,
      venue: "MTH",
      roomNo: "B301",
    },
  ]);

  const [editingRowId, setEditingRowId] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    console.log(tableData);
    setSubmitted(true);
    onSubmit()
  };

  const handleAddRow = () => {
    const newRowId = tableData.length + 1;
    setTableData((prevData) => [
      ...prevData,
      {
        id: newRowId,
        date: "",
        day: "",
        startTime: "",
        endTime: "",
        acronym: "",
        courseCode: "",
        strength: "",
        venue: "",
        roomNo: "",
      },
    ]);
    setEditingRowId(newRowId); // Start editing the newly added row
  };

  const handleEdit = (rowId, column, value) => {
    // Print day and date
    if (column === "date") {
      const date = new Date(value);
      const formattedDate = format(date, "PPP");
      const formattedDay = format(date, "EEEE");
      setTableData((prevData) =>
        prevData.map((row) =>
          row.id === rowId
            ? { ...row, [column]: value, day: formattedDay }
            : row
        )
      );
    } else {
      setTableData((prevData) =>
        prevData.map((row) =>
          row.id === rowId ? { ...row, [column]: value } : row
        )
      );
    }
  };

  const handleSave = (rowId) => {
    const newRow = tableData.find((row) => row.id === rowId);
    if (
      Object.values(newRow).some((value) => value === "") // Check if any value is empty
    ) {
      alert("Please fill in all the data fields.");
      return;
    }
    setEditingRowId(null);
  };

  const handleDelete = (rowId) => {
    setTableData((prevData) => prevData.filter((row) => row.id !== rowId));
    setEditingRowId(null);
  };

  return (
    <div className="flex flex-col h-screen">
      <Card className="h-full w-full flex flex-1 flex-col">
        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-none mt-0 pt-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="h4" color="blue-gray">
                Datesheet List
              </Typography>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleAddRow}
                size="sm"
                color="lightBlue"
                ripple="light"
                className="flex items-center gap-2 h-9"
              >
                <UserPlusIcon className="h-5 w-5" />
                Add Row
              </Button>
              <Button
                onClick={handleSubmit}
                size="sm"
                color="green"
                ripple="light"
                className="flex items-center gap-2 h-9"
              >
                Submit
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody className="p-0 mt-5 flex flex-1 overflow-y-auto">
          <table className="w-full min-w-max table-auto text-left">
            <thead className="sticky top-0 bg-white z-20">
              <tr>
                {TABLE_HEAD.map(({ head, value }) => (
                  <th
                    key={head}
                    className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                    >
                      {head}
                      <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                    </Typography>
                  </th>
                ))}
                <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"></th>
              </tr>
            </thead>
            <tbody>
              {tableData.map(({ id, ...row }) => (
                <tr key={id} className="hover:bg-blue-gray-50">
                  {Object.entries(row).map(([key, value]) => (
                    <td key={key} className="p-4">
                      {editingRowId === id ? ( // Check if the row is being edited
                        <Input
                          type={
                            key === "date"
                              ? "date"
                              : key === "startTime" || key === "endTime"
                              ? "time"
                              : "text"
                          }
                          value={value}
                          onChange={(e) => handleEdit(id, key, e.target.value)}
                          size="sm"
                          color="lightBlue"
                          disabled={key === "day"}
                          outline={false}
                        />
                      ) : (
                        <Typography variant="small" color="blue-gray" className="font-normal text-xs">
                          {value}
                        </Typography>
                      )}
                    </td>
                  ))}
                  <td className="p-4">
                    {editingRowId === id ? (
                      <>
                        <Tooltip content="Save">
                          <IconButton
                            onClick={() => handleSave(id)}
                            color="lightBlue"
                            size="sm"
                            ripple="light"
                          >
                            <BookmarkIcon className="h-5 w-5" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip content="Delete">
                          <IconButton
                            onClick={() => handleDelete(id)}
                            color="lightBlue"
                            size="sm"
                            ripple="light"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </IconButton>
                        </Tooltip>
                      </>
                    ) : (
                      <>
                        <Tooltip content="Edit">
                          <IconButton
                            onClick={() => setEditingRowId(id)}
                            color="lightBlue"
                            size="sm"
                            ripple="light"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip content="Delete">
                          <IconButton
                            onClick={() => handleDelete(id)}
                            color="lightBlue"
                            size="sm"
                            ripple="light"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

export default Datesheet;

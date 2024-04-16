import React, { useState,useEffect,useContext } from "react";
import {
  Button,
  Input,
  Card,
  Typography,
  Tooltip,
  IconButton,
  CardHeader,
  CardBody,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

import { format } from "date-fns";
import {
  ChevronUpDownIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
  BookmarkIcon
} from "@heroicons/react/24/solid";

import InvigilationContext from "../context/InvigilationContext";

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

function AddMemberDialog({ isOpen, setOpen, setTableData }) {
  const { buildingRoomMap } = useContext(InvigilationContext);
  const [datesheetData, setDatesheetData] = useState({});
  const [availableRooms, setAvailableRooms] = useState([]);
  const [availableVenues, setAvailableVenues] = useState([]);

  useEffect(() => {
    if (buildingRoomMap) {
      const venues = Object.keys(buildingRoomMap);
      setAvailableVenues(venues);
    }
  }, [buildingRoomMap]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      if (checked) {
        // Add room to the selected rooms
        setDatesheetData((prevData) => ({
          ...prevData,
          [name]: prevData[name] ? `${prevData[name]},${value}` : value,
        }));
      } else {
        // Remove room from the selected rooms
        setDatesheetData((prevData) => ({
          ...prevData,
          [name]: prevData[name]
            .split(",")
            .filter((room) => room !== value)
            .join(","),
        }));
      }
    } else {
      if (name === "date") {
        const date = new Date(value);
        const formattedDay = format(date, "EEEE");
        setDatesheetData((prevData) => ({
          ...prevData,
          [name]: value,
          day: formattedDay,
        }));
      } else {
        if (name === "venue") {
          const selectedVenueRooms = buildingRoomMap[value] || [];
          setAvailableRooms(selectedVenueRooms);
          setDatesheetData((prevData) => ({
            ...prevData,
            [name]: value,
            roomNo: selectedVenueRooms[0]?.roomNo || "", // Automatically select the first available room
            strength: selectedVenueRooms[0]?.capacity || "", // Automatically select the capacity of the first available room
          }));
        } else {
          setDatesheetData((prevData) => ({
            ...prevData,
            [name]: value,
          }));
        }
      }
    }
  };

  const handleSubmit = () => {
    setTableData((prevData) => [
      ...prevData,
      {
        ...datesheetData,
        roomNo: datesheetData.roomNo.split(","), // Convert comma-separated room numbers to an array
      },
    ]);
    setDatesheetData({});
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={isOpen} onClose={handleCancel}>
      <DialogHeader>Add Classroom</DialogHeader>
      <DialogBody>
        <div className="space-y-4">
          {[
            { head: "Date", value: "date", type: "date" },
            { head: "Day", value: "day", type: "text", readOnly: true },
            { head: "Start Time", value: "startTime", type: "time" },
            { head: "End Time", value: "endTime", type: "time" },
            { head: "Acronym", value: "acronym", type: "text" },
            { head: "Course Code", value: "courseCode", type: "text" },
            {
              head: "Venue",
              value: "venue",
              type: "select",
              options: availableVenues,
            },
            {
              head: "Room No",
              value: "roomNo",
              type: "checkbox",
              options: availableRooms.map((room) => ({
                label: room.roomNo,
                value: room.roomNo,
                capacity: room.capacity,
              })),
            },
            { head: "Strength", value: "strength", type: "number", readOnly: true },
          ].map((item) => (
            <div key={item.value}>
              <label htmlFor={item.value} className="text-sm text-blue-gray-500">
                {item.head}
              </label>
              {item.type === "select" ? (
                <select
                  id={item.value}
                  name={item.value}
                  value={datesheetData[item.value] || ""}
                  onChange={handleChange}
                >
                  <option value="">Select {item.head}</option>
                  {item.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                item.type === "checkbox" ? (
                  <div>
                    <div className="space-y-2">
                      {item.options.map((option) => (
                        <label key={option.value} className="inline-flex items-center">
                          <input
                            type="checkbox"
                            name={item.value}
                            value={option.value}
                            checked={datesheetData.roomNo && datesheetData.roomNo.includes(option.value)}
                            onChange={handleChange}
                            className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                          />
                          <span className="ml-2">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Input
                    type={item.type === "date" ? "date" : item.type === "time" ? "time" : "text"}
                    id={item.value}
                    placeholder={`Enter ${item.head}`}
                    name={item.value}
                    value={datesheetData[item.value] || ""}
                    onChange={handleChange}
                    readOnly={item.readOnly}
                    disabled={item.readOnly}
                  />
                )
              )}
            </div>
          ))}
        </div>
      </DialogBody>
      <DialogFooter>
        <Button variant="text" color="red" onClick={handleCancel} className="mr-1">
          <span>Cancel</span>
        </Button>
        <Button variant="gradient" color="green" onClick={handleSubmit}>
          <span>Confirm</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

function Datesheet({onSubmit}) {
  const {setCourseCode , setDatesheet} =useContext(InvigilationContext)
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
    // Extract course codes from tableData
    const courseCodes = tableData.map(row => row.courseCode);
    
    setCourseCode(courseCodes);
   
    setDatesheet(tableData)
    onSubmit();
  };
  

  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleAddRow = () => {
    setDialogOpen(true); // Open the dialog when Add Row button is clicked
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
    <div className="flex flex-col  h-screen">
      <Card className="h-full w-full flex flex-1 flex-col">
        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-none mt-0 pt-4 sticky top-0 z-20 bg-white"
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
                color="black"
                ripple={true}
                className="flex items-center gap-2 h-9"
              ><UserPlusIcon className="h-5 w-5" />
                Add Row
              </Button>
              <AddMemberDialog isOpen={isDialogOpen} setOpen={setDialogOpen} setTableData={setTableData} />
             
              <Button
                onClick={handleSubmit}
                size="sm"
                color="green"
                ripple={true}
                className="flex items-center gap-2 h-9"
              >
                Submit
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody className="p-0 mt-5 flex flex-1 overflow-y-auto">
        <div className="w-full overflow-hidden">
  <table className="w-full text-left table-fixed">
    <thead className="sticky top-0 bg-white">
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
    <tbody className="overflow-y-auto max-h-[400px]">
      {tableData.map(({ id, ...row }) => (
        <tr key={id} className="hover:bg-blue-gray-50">
          {Object.entries(row).map(([key, value]) => (
            <td key={key} className={`p-4 ${editingRowId === id ? 'bg-blue-50' : ''}`}>
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
                  color="black"
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
                    color="black"
                    size="sm"
                    ripple={true}
                  >
                    <BookmarkIcon className="h-5 w-5" />
                  </IconButton>
                </Tooltip>
                <Tooltip content="Delete">
                  <IconButton
                    onClick={() => handleDelete(id)}
                    color="red"
                    size="sm"
                    ripple={true}
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
                    color="black"
                    size="sm"
                    ripple={true}
                  >
                    <PencilIcon className="h-5 w-5" />
                  </IconButton>
                </Tooltip>
                <Tooltip content="Delete">
                  <IconButton
                    onClick={() => handleDelete(id)}
                    color="black"
                    size="sm"
                    ripple={true}
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
</div>

        </CardBody>
      </Card>
    </div>
  );
}

export default Datesheet;

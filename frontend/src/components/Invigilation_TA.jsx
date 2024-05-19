import React, { useContext, useEffect, useState } from "react";
import Select from "react-select";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Input,
  Tooltip,
  Typography,
} from "@material-tailwind/react";

import {
  BookmarkIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
} from "@heroicons/react/24/solid";

import InvigilationContext from "../context/InvigilationContext";

const TABLE_HEAD = [
  {
    head: "Admission No.",
    value: "admissionNo",
  },
  {
    head: "Name",
    value: "name",
  },
  {
    head: "Email ID",
    value: "email",
  },
  {
    head: "Course Code",
    value: "courseCode",
  },
];

function AddMemberDialog({ isOpen, setOpen, setTableData }) {
  const { courseCode } = useContext(InvigilationContext);
  const [courseCodeOptions, setCourseCodeOptions] = useState([]);
  const [TAdata, setTAdata] = useState({
    admissionNo: "",
    name: "",
    email: "",
    courseCode: "",
  });

  useEffect(() => {
    // Load course codes when the component mounts
    setCourseCodeOptions(
      courseCode.map((option) => ({ value: option, label: option }))
    );
  }, [courseCode]);

  const handleChange = (e, name) => {
    console;
    if (e.target) {
      // For regular input fields
      setTAdata((prevData) => ({
        ...prevData,
        [name]: e.target.value,
      }));
    } else {
      // For the courseCode dropdown

      setTAdata((prevData) => ({
        ...prevData,
        courseCode: String(e.value) || "", // Use e.value to get the selected option value
      }));
    }
    console.log(TAdata);
  };

  const handleSubmit = async () => {
    console.log(TAdata);
    setTAdata({
      admissionNo: "",
      name: "",
      email: "",
      courseCode: "",
    });
    setOpen(false); // Close the dialog after submission

    console.log(TAdata);
    setTableData((prevData) => [
      ...prevData,
      {
        ...TAdata,
        // Convert comma-separated room numbers to an array
      },
    ]);
  };

  const handleCancel = () => {
    setOpen(false); // Close the dialog when Cancel button is clicked
  };

  return (
    <Dialog open={isOpen} onClose={handleCancel}>
      <DialogHeader>Add Member</DialogHeader>
      <DialogBody>
        <div className="space-y-4">
          {TABLE_HEAD.map(({ head, value }) => (
            <div key={value}>
              <label htmlFor={value} className="text-sm text-blue-gray-500">
                {head}
              </label>
              {value === "courseCode" ? (
                <Select
                  id={value}
                  name={value}
                  value={courseCodeOptions.find(
                    (option) => option.value === TAdata[value]
                  )}
                  onChange={(selectedOption) =>
                    handleChange(selectedOption, { name: value })
                  }
                  options={courseCodeOptions}
                  placeholder="Select Course Code"
                />
              ) : (
                <Input
                  type="text"
                  id={value}
                  placeholder={`Enter ${head}`}
                  name={value}
                  value={TAdata[value]}
                  onChange={(e) => handleChange(e, value)}
                />
              )}
            </div>
          ))}
        </div>
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
        <Button variant="gradient" color="green" onClick={handleSubmit}>
          <span>Confirm</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

function Invigilation_TA({ onSubmit }) {
  const { setTA } = useContext(InvigilationContext);
  const [tableData, setTableData] = useState([
    {
      id: 1,
      admissionNo: "2021001",
      name: "John Doe",
      email: "john@example.com",
      courseCode: "CS101",
    },
    {
      id: 2,
      admissionNo: "2021002",
      name: "Jane Doe",
      email: "jane@example.com",
      courseCode: "CS102",
    },
  ]);

  const [editingRowId, setEditingRowId] = useState(null);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleAddRow = () => {
    setDialogOpen(true); // Open the dialog when Add Row button is clicked
  };
  const handleSubmit = async () => {
    console.log(tableData);

    setTA(tableData);
    onSubmit();
  };

  const handleEdit = (rowId, column, value) => {
    setTableData((prevData) =>
      prevData.map((row) =>
        row.id === rowId ? { ...row, [column]: value } : row
      )
    );
  };

  useEffect(() => {}, [tableData]);

  const handleSave = (rowId) => {
    const newRow = tableData.find((row) => row.id === rowId);
    if (Object.values(newRow).some((value) => value === "")) {
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
          className="rounded-none mt-0 pt-4 sticky top-0 z-20 bg-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="h4" color="blue-gray">
                Student List
              </Typography>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleAddRow}
                size="sm"
                color="gray"
                ripple={true}
                className="flex items-center gap-2 h-9"
              >
                <UserPlusIcon className="h-5 w-5" />
                Add Row
              </Button>
              <AddMemberDialog
                isOpen={isDialogOpen}
                setOpen={setDialogOpen}
                setTableData={setTableData}
              />

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
                  {TABLE_HEAD.map(({ head }) => (
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
                      <td key={key} className="p-4">
                        {editingRowId === id ? (
                          <Input
                            type="text"
                            value={value}
                            onChange={(e) =>
                              handleEdit(id, key, e.target.value)
                            }
                            size="sm"
                            color="gray"
                            outline={false}
                          />
                        ) : (
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal text-xs"
                          >
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
                              color="gray"
                              size="sm"
                              ripple={true}
                            >
                              <BookmarkIcon className="h-5 w-5" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip content="Delete">
                            <IconButton
                              onClick={() => handleDelete(id)}
                              color="gray"
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
                              color="gray"
                              size="sm"
                              ripple={true}
                            >
                              <PencilIcon className="h-5 w-5" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip content="Delete">
                            <IconButton
                              onClick={() => handleDelete(id)}
                              color="gray"
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

export default Invigilation_TA;

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

import {
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
  BookmarkIcon
} from "@heroicons/react/24/solid";

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
  {
    head: "Remark",
    value: "remark",
  },
];

function TAtable({onSubmit}) {
  const [tableData, setTableData] = useState([
    {
      id: 1,
      admissionNo: "2021001",
      name: "John Doe",
      email: "john@example.com",
      courseCode: "CS101",
      remark: "Excellent",
    },
    {
      id: 2,
      admissionNo: "2021002",
      name: "Jane Doe",
      email: "jane@example.com",
      courseCode: "CS102",
      remark: "Good",
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
        admissionNo: "",
        name: "",
        email: "",
        courseCode: "",
        remark: "",
      },
    ]);
    setEditingRowId(newRowId);
  };

  const handleEdit = (rowId, column, value) => {
    setTableData((prevData) =>
      prevData.map((row) =>
        row.id === rowId ? { ...row, [column]: value } : row
      )
    );
  };

  const handleSave = (rowId) => {
    const newRow = tableData.find((row) => row.id === rowId);
    if (
      Object.values(newRow).some((value) => value === "") 
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
                Student List
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
            <tbody>
              {tableData.map(({ id, ...row }) => (
                <tr key={id} className="hover:bg-blue-gray-50">
                  {Object.entries(row).map(([key, value]) => (
                    <td key={key} className="p-4">
                      {editingRowId === id ? ( 
                        <Input
                          type="text"
                          value={value}
                          onChange={(e) => handleEdit(id, key, e.target.value)}
                          size="sm"
                          color="lightBlue"
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

export default TAtable;

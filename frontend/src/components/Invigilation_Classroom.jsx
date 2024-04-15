import React, { useState } from "react";
import {
  Button,
  Input,
  Card,
  Typography,
  Tooltip,
  IconButton,
  CircularProgress,
} from "@material-tailwind/react";
import { UserPlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

const TABLE_HEAD = [
  {
    head: "Building",
    value: "building",
  },
  {
    head: "Room No",
    value: "roomNo",
  },
  {
    head: "Capacity",
    value: "capacity",
  },
];

function Invigilation_Classroom({ onSubmission }) {
  const [tableData, setTableData] = useState([
    { id: 1, building: "Building 1", roomNo: "Room 101", capacity: 30 },
    { id: 2, building: "Building 2", roomNo: "Room 201", capacity: 25 },
    { id: 3, building: "Building 3", roomNo: "Room 301", capacity: 35 },
  ]);

  const [submitted, setSubmitted] = useState(false);

  const handleAddRow = () => {
    setTableData((prevData) => [
      ...prevData,
      {
        id: prevData.length + 1,
        building: "",
        roomNo: "",
        capacity: "",
        editing: true,
      },
    ]);
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
    if (!newRow.building || !newRow.roomNo || !newRow.capacity) {
      alert("Please fill in all the data fields.");
      return;
    }
    setTableData((prevData) =>
      prevData.map((row) =>
        row.id === rowId ? { ...row, editing: false } : row
      )
    );
  };

  const handleDelete = (rowId) => {
    setTableData((prevData) => prevData.filter((row) => row.id !== rowId));
  };

  const handleSubmit = async () => {
    // Filter out the id field from each object in the tableData array
    const requestData = tableData.map(({ id, ...rest }) => rest);

    console.log(JSON.stringify(requestData));

    try {
      // Simulate response
      // const response = await fetch(`${API}/api/classroom/`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(requestData),
      // });

      // if (!response.ok) {
      //   throw new Error("Network response was not ok");
      // }

      setSubmitted(true);
      onSubmission();
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <div className="mt-8 max-w-3xl mx-auto">
      <Button color="blue" onClick={handleAddRow}>
        <UserPlusIcon className="h-5 w-5 mr-2" /> Add Another Row
      </Button>
      <Card className="mt-4">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((header, index) => (
                  <th
                    key={index}
                    className="border-b border-blue-gray-100 bg-blue-gray-50 px-2 py-2 md:px-3 md:py-3"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      {header.head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row) => (
                <tr key={row.id}>
                  {TABLE_HEAD.map((header, index) => (
                    <td
                      key={index}
                      className="px-2 py-2 border-b border-blue-gray-50 md:px-3 md:py-3"
                    >
                      {row.editing ? (
                        <Input
                          type="text"
                          value={row[header.value]}
                          onChange={(e) =>
                            handleEdit(row.id, header.value, e.target.value)
                          }
                        />
                      ) : (
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {row[header.value]}
                        </Typography>
                      )}
                    </td>
                  ))}
                  <td className="px-2 py-2 space-x-2 md:px-3 md:py-3">
                    {row.editing ? (
                      <>
                        <Tooltip content="Save User">
                          <IconButton variant="text">
                            <PencilIcon
                              className="size-4"
                              onClick={() => handleSave(row.id)}
                            />
                          </IconButton>
                        </Tooltip>
                      </>
                    ) : (
                      <>
                        <Tooltip content="Edit User">
                          <IconButton variant="text">
                            <PencilIcon
                              className="size-4"
                              onClick={() =>
                                handleEdit(row.id, "editing", true)
                              }
                            />
                          </IconButton>
                        </Tooltip>
                        <Tooltip content="Delete User">
                          <IconButton variant="text">
                            <TrashIcon
                              className="size-4"
                              onClick={() => handleDelete(row.id)}
                            />
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
      </Card>
      {!submitted && (
        <div className="mt-4">
          <Button color="blue" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      )}
    </div>
  );
}

export default Invigilation_Classroom;

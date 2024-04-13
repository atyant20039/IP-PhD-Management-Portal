import React, { useState } from "react";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Tooltip,
  IconButton,
} from "@material-tailwind/react";
import {
  ChevronUpDownIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
  BookmarkIcon,
} from "@heroicons/react/24/solid";

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

function Classroom({ onSubmit }) {
  const [tableData, setTableData] = useState([
    { id: 1, building: "Building 1", roomNo: "Room 101", capacity: 30 },
    { id: 2, building: "Building 2", roomNo: "Room 201", capacity: 25 },
    { id: 3, building: "Building 3", roomNo: "Room 301", capacity: 35 },
  ]);

  const [editingRowId, setEditingRowId] = useState(null);

  const handleAddRow = () => {
    const newRowId = tableData.length + 1;
    setTableData((prevData) => [
      ...prevData,
      {
        id: newRowId,
        building: "",
        roomNo: "",
        capacity: "",
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
    if (!newRow.building || !newRow.roomNo || !newRow.capacity) {
      alert("Please fill in all the data fields.");
      return;
    }
    setEditingRowId(null);
  };

  const handleDelete = (rowId) => {
    setTableData((prevData) => prevData.filter((row) => row.id !== rowId));
  };

  const handleSubmit = async () => {
    //
    console.log("Table data submitted:", tableData);
    onSubmit();
  };
  return (
    <div className="flex flex-col h-screen">
      <Card className="h-full w-full flex flex-1 flex-col">
        <CardHeader
          className="rounded-none mt-0 pt-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="h4" color="blue-gray">
                Classroom List
              </Typography>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleAddRow}
                size="sm"
                color="blue"
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
                      <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4"/>
                    </Typography>
                  </th>
                ))}
                <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"></th>
              </tr>
            </thead>
            <tbody>
              {tableData.map(({ id, building, roomNo, capacity }) => (
                <tr key={id} className="hover:bg-blue-gray-50">
                  <td className="p-4">
                    {editingRowId === id ? ( 
                      <Input
                        value={building}
                        onChange={(e) =>
                          handleEdit(id, "building", e.target.value)
                        }
                        size="sm"
                        color="lightBlue"
                        outline={false}
                      />
                    ) : (
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal text-xs"
                      >
                        {building}
                      </Typography>
                    )}
                  </td>
                  <td className="p-4">
                    {editingRowId === id ? ( 
                      <Input
                        value={roomNo}
                        onChange={(e) =>
                          handleEdit(id, "roomNo", e.target.value)
                        }
                        size="sm"
                        color="lightBlue"
                        outline={false}
                      />
                    ) : (
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal text-xs"
                      >
                        {roomNo}
                      </Typography>
                    )}
                  </td>
                  <td className="p-4">
                    {editingRowId === id ? ( 
                      <Input
                        value={capacity}
                        onChange={(e) =>
                          handleEdit(id, "capacity", e.target.value)
                        }
                        size="sm"
                        color="lightBlue"
                        outline={false}
                      />
                    ) : (
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal text-xs"
                      >
                        {capacity}
                      </Typography>
                    )}
                  </td>
                  <td className="p-4">
                    {editingRowId === id ? ( 
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
                    ) : (
                      <>
                        <Tooltip content="Edit">
                          <IconButton
                            onClick={() => setEditingRowId(id)}
                            color="lightBlue"
                            size="sm"
                            ripple="blue"
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

export default Classroom;

import {
  BookmarkIcon,
  ChevronUpDownIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
} from "@heroicons/react/24/solid";
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
import React, { useContext, useEffect, useState } from "react";

import InvigilationContext from "../context/InvigilationContext";

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

const API = import.meta.env.VITE_BACKEND_URL;

function AddMemberDialog({ isOpen, setOpen, fetchData }) {
  const [classroomData, setClassroomData] = useState({
    building: "",
    roomNo: "",
    capacity: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClassroomData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${API}/api/classroom/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(classroomData),
      });

      if (!response.ok) {
        throw new Error("Failed to add classroom");
      }
      setClassroomData({
        building: "",
        roomNo: "",
        capacity: "",
      });

      setOpen(false); // Close the dialog after submission
    } catch (error) {
      console.error("Error adding classroom:", error);
    }
    fetchData();
  };

  const handleCancel = () => {
    setOpen(false); // Close the dialog when Cancel button is clicked
  };

  return (
    <Dialog open={isOpen} onClose={handleCancel}>
      <DialogHeader>Add Classroom</DialogHeader>
      <DialogBody>
        <div className="space-y-4">
          <div>
            <label htmlFor="building" className="text-sm text-blue-gray-500">
              Building
            </label>
            <Input
              type="text"
              id="building"
              placeholder="Enter building name"
              name="building"
              value={classroomData.building}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="roomNo" className="text-sm text-blue-gray-500">
              Room No
            </label>
            <Input
              type="text"
              id="roomNo"
              placeholder="Enter room number"
              name="roomNo"
              value={classroomData.roomNo}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="capacity" className="text-sm text-blue-gray-500">
              Capacity
            </label>
            <Input
              type="text"
              id="capacity"
              placeholder="Enter capacity"
              name="capacity"
              value={classroomData.capacity}
              onChange={handleChange}
            />
          </div>
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
function Classroom({ onSubmit }) {
  const { buildingRoomMap, setClassroom } = useContext(InvigilationContext);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editedRowData, setEditedRowData] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${API}/api/classroom`);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setTableData(data.results);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleAddRow = () => {
    setDialogOpen(true); // Open the dialog when Add Row button is clicked
  };

  const handleEdit = (rowId, column, value) => {
    setEditedRowData((prevData) => ({
      ...prevData,
      [rowId]: { ...prevData[rowId], [column]: value },
    }));
  };

  const handleSave = async (rowId) => {
    const editedRow = editedRowData[rowId];

    try {
      const response = await fetch(`${API}/api/classroom/${rowId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedRow),
      });

      if (!response.ok) {
        console.log(response);
        throw new Error("Failed to edit row");
      }

      const updatedRowData = await response.json();
      setTableData((prevData) =>
        prevData.map((row) =>
          row.id === rowId ? { ...row, ...updatedRowData } : row
        )
      );
      setEditingRowId(null);
    } catch (error) {
      console.error("Error editing row:", error);
    }
  };

  const handleDelete = async (rowId) => {
    try {
      const response = await fetch(`${API}/api/classroom/${rowId}/`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete row");
      }

      // Update the table data state after successful deletion
      setTableData((prevData) => prevData.filter((row) => row.id !== rowId));
    } catch (error) {
      console.error("Error deleting row:", error);
    }
  };

  const handleSubmit = async () => {
    onSubmit();
    setClassroom(tableData);
  };

  return (
    <div className="flex flex-col h-screen">
      <Card className=" w-full flex flex-1 flex-col">
        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-none mt-0 pt-4 sticky top-0 z-20 bg-white"
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
                color="black"
                ripple={true}
                className="flex items-center gap-2 h-9"
              >
                <UserPlusIcon className="h-5 w-5" />
                Add Row
              </Button>
              <AddMemberDialog
                isOpen={isDialogOpen}
                setOpen={setDialogOpen}
                fetchData={fetchData}
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
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Typography color="blue-gray">Loading...</Typography>
            </div>
          ) : (
            <div className="w-full overflow-hidden">
              <table className="w-full min-w-max table-auto text-left">
                <thead className="sticky top-0 bg-white ">
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
                          <ChevronUpDownIcon
                            strokeWidth={2}
                            className="h-4 w-4"
                          />
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
                            value={editedRowData[id]?.building || building}
                            onChange={(e) =>
                              handleEdit(id, "building", e.target.value)
                            }
                            size="sm"
                            color="black"
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
                            value={editedRowData[id]?.roomNo || roomNo}
                            onChange={(e) =>
                              handleEdit(id, "roomNo", e.target.value)
                            }
                            size="sm"
                            color="black"
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
                            value={editedRowData[id]?.capacity || capacity}
                            onChange={(e) =>
                              handleEdit(id, "capacity", e.target.value)
                            }
                            size="sm"
                            color="black"
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
                              color="black"
                              size="sm"
                              ripple={true}
                            >
                              <BookmarkIcon className="h-5 w-5" />
                            </IconButton>
                          </Tooltip>
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
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default Classroom;

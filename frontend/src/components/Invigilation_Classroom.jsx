import { ArrowRightIcon, XCircleIcon } from "@heroicons/react/24/outline";
import {
  CheckCircleIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import {
  Alert,
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
  Spinner,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import swal from "sweetalert";
import convertDataToXLSX from "./utils/TabletoXlxs";

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
  {
    head: "",
    value: "",
  },
];

const API = import.meta.env.VITE_BACKEND_URL;

function AddRowDialog({ isOpen, setOpen, fetchData }) {
  const [classroomData, setClassroomData] = useState({
    building: "",
    roomNo: "",
    capacity: "",
  });
  const [rowError, setRowError] = useState();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClassroomData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      // console.log("selected building: ", selectedBuilding);
      // setClassroomData((prevData) => ({
      //   ...prevData,
      //   building: selectedBuilding,
      // }));
      if (
        classroomData.building == "" ||
        classroomData.capacity == "" ||
        classroomData.roomNo == ""
      ) {
        setRowError("All fields are required");
        return;
      }
      console.log(classroomData);
      await axios.post(`${API}/api/classroom/`, classroomData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      handleCancel();
    } catch (error) {
      console.error(error);
      if (error.response.data.error) {
        setRowError(error.response?.data?.error);
      } else if (error.response.data.non_field_errors) {
        setRowError(error.response.data.non_field_errors[0]);
      }
    }
    fetchData();
  };

  const handleCancel = () => {
    setOpen(false); // Close the dialog when Cancel button is clicked
    setRowError();
    setClassroomData({
      building: "",
      roomNo: "",
      capacity: "",
    });
  };

  return (
    <Dialog open={isOpen} onClose={handleCancel}>
      <DialogHeader>Add Classroom</DialogHeader>
      <DialogBody>
        <div className="space-y-4">
          <div>
            {/* <label htmlFor="building" className="text-sm text-blue-gray-500">
              Building
            </label> */}
            {/* <Input
              type="text"
              label="Building"
              required
              id="building"
              placeholder="Enter building name"
              name="building"
              value={classroomData.building}
              onChange={handleChange}
            /> */}
            <select
              required
              type="text"
              label="Building*"
              id="building"
              placeholder="Select Building"
              name="building"
              defaultValue=""
              onChange={handleChange}
              className="w-full h-10 border pl-2 border-blue-gray-200/70 rounded-lg"
            >
              <option value="" disabled hidden>
                Building*
              </option>
              <option value="LHC">LHC</option>
              <option value="RnD">RnD</option>
              <option value="Old Acad">Old Acad</option>
              <option value="Library">Library</option>
            </select>
          </div>
          <div>
            {/* <label htmlFor="roomNo" className="text-sm text-blue-gray-500">
              Room No
            </label> */}
            <Input
              type="text"
              label="Room No"
              required
              id="roomNo"
              placeholder="Enter room number"
              name="roomNo"
              value={classroomData.roomNo}
              onChange={handleChange}
            />
          </div>
          <div>
            {/* <label htmlFor="capacity" className="text-sm text-blue-gray-500">
              Capacity
            </label> */}
            <Input
              type="number"
              label="Capacity"
              onWheel={(e) => e.target.blur()}
              required
              id="capacity"
              placeholder="Enter capacity"
              name="capacity"
              value={classroomData.capacity}
              onChange={handleChange}
            />
          </div>
        </div>
        {rowError && (
          <div className="mt-4">
            <Alert variant="ghost" color="red" className="text-red-500">
              {rowError}
            </Alert>
          </div>
        )}
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
function Classroom({ onSubmit, setClassroomFile }) {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editedRowData, setEditedRowData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API}/api/classroom`);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setTableData(data.results);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleAddRow = () => {
    setDialogOpen(true); // Open the dialog when Add Row button is clicked
  };

  const editButtonHandler = (id, rowData) => {
    setIsEditing(true);
    setEditingRowId(id);
    setEditedRowData({
      [id]: rowData,
    });
  };

  const handleEdit = (rowId, column, value) => {
    setEditedRowData((prevData) => ({
      ...prevData,
      [rowId]: { ...prevData[rowId], [column]: value },
    }));
  };

  const handleSave = async (rowId) => {
    const editedRow = editedRowData[rowId];
    const originalRow = tableData.find((row) => row.id === rowId);

    if (editedRow.capacity === originalRow.capacity) {
      // No change, return early
      setEditingRowId(null);
      setIsEditing(false);
      return;
    }

    try {
      console.log(editedRow);
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
    } finally {
      setIsEditing(false);
    }
  };

  const showAlert = async (rowId) => {
    const userResponse = await swal({
      title: "Are you sure?",
      icon: "warning",
      buttons: ["Cancel", "Confirm"],
      dangerMode: true,
    });
    if (userResponse) {
      handleDelete(rowId);
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
    try {
      const classRoomXLSX = await convertDataToXLSX(
        tableData,
        "Classroom.xlsx"
      );
      setClassroomFile(classRoomXLSX);
      onSubmit();
    } catch (error) {
      swal("Error", error, "error");

      console.error("Error: ", error);
    }
  };

  return (
    <div className="h-full w-full">
      <Card className=" w-full h-full" shadow={false}>
        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-none mt-0 sticky top-0 z-20 bg-white"
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
                variant="outlined"
                ripple={true}
                className="flex items-center gap-2"
              >
                <PlusIcon className="h-5 w-5" />
                Add Classroom
              </Button>
              <AddRowDialog
                isOpen={isDialogOpen}
                setOpen={setDialogOpen}
                fetchData={fetchData}
              />
              <Button
                onClick={handleSubmit}
                size="sm"
                color="green"
                ripple={true}
                className="flex items-center gap-2"
              >
                Submit
                <ArrowRightIcon className="size-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody className="p-0 mt-5 flex flex-1 overflow-y-auto">
          {tableData && tableData.length === 0 ? (
            <div className="w-full h-full flex flex-col place-content-center place-items-center">
              {loading ? (
                <Spinner className="size-12" />
              ) : (
                <div>
                  <XCircleIcon className="h-48 w-48" />
                  <Typography variant="h3" className="cursor-default">
                    No Data Found
                  </Typography>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full">
              <table className="w-full min-w-max table-auto text-left">
                <thead className="sticky top-0 bg-white z-20">
                  <tr>
                    {TABLE_HEAD.map(({ head }) => (
                      <th
                        key={head}
                        className="cursor-default border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors"
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
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row) => (
                    <tr key={row.id} className="hover:bg-blue-gray-50">
                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal text-xs"
                        >
                          {row.building}
                        </Typography>
                        {/* {editingRowId === row.id ? (
                          <select
                            required
                            type="text"
                            label="Building"
                            id="building"
                            placeholder="Select Building"
                            name="building"
                            value={
                              isEditing
                                ? editedRowData[row.id]?.building
                                : row.building
                            }
                            onChange={(e) =>
                              handleEdit(row.id, "building", e.target.value)
                            }
                            className="w-full h-10 border border-black rounded-lg"
                          >
                            <option value="" disabled selected hidden>
                              Building
                            </option>
                            <option value="LHC">LHC</option>
                            <option value="RnD">RnD</option>
                            <option value="Old Acad">Old Acad</option>
                            <option value="Library">Library</option>
                          </select>
                        ) : (
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal text-xs"
                          >
                            {row.building}
                          </Typography>
                        )} */}
                      </td>
                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal text-xs"
                        >
                          {row.roomNo}
                        </Typography>
                        {/* {editingRowId === row.id ? (
                          <Input
                            value={
                              isEditing
                                ? editedRowData[row.id]?.roomNo
                                : row.roomNo
                            }
                            onChange={(e) =>
                              handleEdit(row.id, "roomNo", e.target.value)
                            }
                            color="black"
                          />
                        ) : (
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal text-xs"
                          >
                            {row.roomNo}
                          </Typography>
                        )} */}
                      </td>
                      <td className="p-4">
                        {editingRowId === row.id ? (
                          <Input
                            type="number"
                            value={
                              isEditing
                                ? editedRowData[row.id]?.capacity
                                : row.capacity
                            }
                            onChange={
                              (e) => {
                                const value = e.target.value;
                                if (value >= 0) {
                                  handleEdit(row.id, "capacity", value);
                                }
                              }
                              // handleEdit(row.id, "capacity", e.target.value)
                            }
                            color="black"
                            min={0}
                          />
                        ) : (
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal text-xs"
                          >
                            {row.capacity}
                          </Typography>
                        )}
                      </td>
                      <td className="p-4">
                        {editingRowId === row.id ? (
                          <Tooltip content="Save">
                            <IconButton
                              onClick={() => handleSave(row.id)}
                              color="black"
                              size="sm"
                              ripple={true}
                              variant="text"
                            >
                              <CheckCircleIcon className="size-4" />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <>
                            <Tooltip content="Edit">
                              <IconButton
                                onClick={() => editButtonHandler(row.id, row)}
                                color="black"
                                size="sm"
                                ripple={true}
                                variant="text"
                              >
                                <PencilIcon className="size-4" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip content="Delete">
                              <IconButton
                                onClick={() => showAlert(row.id)}
                                color="black"
                                size="sm"
                                ripple={true}
                                variant="text"
                              >
                                <TrashIcon className="size-4" />
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

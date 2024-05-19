import React, { useState } from "react";

import {
  Button,
  Card,
  CardBody,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
} from "@material-tailwind/react";
const API = import.meta.env.VITE_BACKEND_URL;
function AddClassroom({ fetchData }) {
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
    console.log(fetchData);
  };

  const handleCancel = () => {
    setOpen(false); // Close the dialog when Cancel button is clicked
  };
  return (
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
  );
}

function AddDateSheet() {
  return (
    <div>
      <Card shadow={false}>
        <CardBody>Add single professor form code here</CardBody>
      </Card>
    </div>
  );
}

function AddMemberDialog({ isOpen, setOpen, member, fetchData }) {
  const handleOpen = () => setOpen(!isOpen);
  return (
    <Dialog open={isOpen} handler={handleOpen}>
      <DialogHeader>Add {member}</DialogHeader>
      <DialogBody>
        {member == "Classroom" ? (
          <AddClassroom fetchData={fetchData} />
        ) : member == "Professor" ? (
          AddDateSheet()
        ) : null}
      </DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          color="red"
          onClick={handleOpen}
          className="mr-1"
        >
          <span>Cancel</span>
        </Button>
        <Button variant="gradient" color="green" onClick={handleOpen}>
          <span>Confirm</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

export default AddMemberDialog;

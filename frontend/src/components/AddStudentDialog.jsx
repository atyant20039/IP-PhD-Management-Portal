import React from "react";

import {
  Button,
  Card,
  CardBody,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";

function AddStudentDialog({ isOpen, setOpen }) {
  const handleOpen = () => setOpen(!isOpen);
  return (
    <Dialog open={isOpen} handler={handleOpen}>
      <DialogHeader>Add Student</DialogHeader>
      <DialogBody>
        <div>
          <Card shadow={false}>
            <CardBody>
              Add students by file here
              <div></div>
              <div></div>
            </CardBody>
          </Card>
          <Card shadow={false}>
            <CardBody>Add single student form code here</CardBody>
          </Card>
        </div>
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

export default AddStudentDialog;

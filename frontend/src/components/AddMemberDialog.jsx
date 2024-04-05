import React from "react";

import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Card,
  CardBody,
} from "@material-tailwind/react";

function AddStudent() {
  return (
    <div>
      <Card shadow={false}>
        <CardBody>Upload Students by file code here</CardBody>
      </Card>
      <Card shadow={false}>
        <CardBody>Add single student form code here</CardBody>
      </Card>
    </div>
  );
}

function AddProfessor() {
  return (
    <div>
      <Card shadow={false}>
        <CardBody>Add single professor form code here</CardBody>
      </Card>
    </div>
  );
}

function AddMemberDialog({ isOpen, setOpen, member }) {
  const handleOpen = () => setOpen(!isOpen);
  return (
    <Dialog open={isOpen} handler={handleOpen}>
      <DialogHeader>Add {member}</DialogHeader>
      <DialogBody>
        {member == "Student"
          ? AddStudent()
          : member == "Professor"
          ? AddProfessor()
          : null}
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

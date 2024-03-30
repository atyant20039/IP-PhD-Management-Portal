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

function filterStudents() {
  return (
    <Card shadow={false}>
      <CardBody>Form to filter students here</CardBody>
    </Card>
  );
}

function filterProfessors() {
  return (
    <Card shadow={false}>
      <CardBody>Form to filter professors here</CardBody>
    </Card>
  );
}

function FilterDialog({ isOpen, setOpen, member }) {
  const handleOpen = () => setOpen(!isOpen);
  return (
    <Dialog open={isOpen} handler={handleOpen}>
      <DialogHeader>Filter {member}</DialogHeader>
      <DialogBody>
        {member == "Students"
          ? filterStudents()
          : member == "Professors"
          ? filterProfessors()
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

export default FilterDialog;

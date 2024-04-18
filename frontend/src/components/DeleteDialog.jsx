import React, { useContext, useState } from "react";

import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import {
  Alert,
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Spinner,
  Typography,
} from "@material-tailwind/react";

import FacultyContext from "../context/FacultyContext";

function DeleteDialog({ isOpen, setOpen, row }) {
  const [isSubmitting, setSubmitting] = useState(false);
  const [error, setError] = useState([]);
  const { deleteFaculty } = useContext(FacultyContext);

  const handleDelete = async () => {
    if (row) {
      setSubmitting(true);
      const response = await deleteFaculty(row.id);
      if (response) {
        setError(response);
        setSubmitting(false);
      } else {
        handleOpen();
      }
    }
  };

  const handleOpen = () => {
    setSubmitting(false);
    setError([]);
    setOpen(!isOpen);
  };

  return (
    <Dialog open={isOpen} handler={handleOpen}>
      <DialogHeader>Alert</DialogHeader>
      <DialogBody className="flex flex-col place-items-center">
        <ExclamationCircleIcon className="size-36 text-red-400" />
        <Typography variant="h5" color="blue-gray">
          This action is not reversible. Are you sure to delete {row?.name}?
        </Typography>
        {error.length != 0 &&
          error.map((e) => (
            <Alert variant="ghost" color="red" className="text-red-500">
              {e}
            </Alert>
          ))}
      </DialogBody>
      <DialogFooter>
        {isSubmitting ? (
          <Spinner className="size-10" />
        ) : (
          <div>
            <Button
              variant="text"
              color="red"
              onClick={handleOpen}
              className="mr-1"
            >
              <span>Cancel</span>
            </Button>
            <Button
              variant="gradient"
              color="red"
              onClick={handleDelete}
              className="mr-1"
            >
              <span>Delete</span>
            </Button>
          </div>
        )}
      </DialogFooter>
    </Dialog>
  );
}

export default DeleteDialog;

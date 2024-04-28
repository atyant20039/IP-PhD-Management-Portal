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
import React, { useContext, useState } from "react";

import FacultyContext from "../context/FacultyContext";
import StudentContext from "../context/StudentContext";

function DeleteDialog({ isOpen, setOpen, row }) {
  const [isSubmitting, setSubmitting] = useState(false);
  const [error, setError] = useState([]);
  const { deleteFaculty } = useContext(FacultyContext);
  const { deleteStudent } = useContext(StudentContext);
  const BASE = import.meta.env.VITE_FRONTEND_URL;
  const handleDelete = async () => {
    if (row) {
      setSubmitting(true);
      var response;
      if (row.rollNumber) {
        response = await deleteStudent(row.rollNumber);
      } else {
        response = await deleteFaculty(row.id);
      }

      if (response) {
        setError(response);
        setSubmitting(false);
      } else {
        handleOpen();
        if (row.rollNumber) {
          window.location.href = `${BASE}/db`;
        }
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
      <DialogHeader className="cursor-default">Alert</DialogHeader>
      <DialogBody className="flex flex-col place-items-center">
        <ExclamationCircleIcon className="size-36 text-red-400" />
        <Typography variant="h5" color="blue-gray" className="cursor-default">
          This action is not reversible. Are you sure to delete {row?.name}?
        </Typography>
        {error.length != 0 &&
          error.map((e) => (
            <Alert variant="ghost" color="red" key={e} className="text-red-500">
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

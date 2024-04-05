import React from "react";

import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

function AlertDialog({ isOpen, setOpen, message }) {
  const handleOpen = () => setOpen(!isOpen);
  return (
    <Dialog open={isOpen} handler={handleOpen}>
      <DialogHeader>Alert</DialogHeader>
      <DialogBody>{message}</DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          color="red"
          onClick={handleOpen}
          className="mr-1"
        >
          <span>Close</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

export default AlertDialog;

import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Chip,
} from "@material-tailwind/react";

function FilterDialog({ isOpen, setOpen, onApplyFilters }) {
  const handleOpen = () => setOpen(!isOpen);

  const departmentOptions = ["CSE", "CB", "ECE", "HCD", "SSH", "MATHS"];

  const [selectedOptions, setSelectedOptions] = useState({
    department: "",
  });

  const handleOptionSelect = (optionType, optionValue) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [optionType]: prevOptions[optionType] === optionValue ? "" : optionValue,
    }));
  };
  const getColor = (optionType, optionValue) => {
    return selectedOptions[optionType] === optionValue ? "bg-green-200" : "";
  };

  const handleApplyFilters = () => {
    onApplyFilters(selectedOptions);
    handleOpen();
  };

  const handleClearAll = () => {
    setSelectedOptions({
      gender: "",
    });
  };

  return (
    <Dialog open={isOpen} handler={handleOpen}>
      <DialogHeader>Filter Professor</DialogHeader>
      <DialogBody>
        <div className="text-sm text-blue-gray-500 mb-2">Departments:</div>
        <div className="flex flex-wrap gap-2 mb-2">
          {departmentOptions.map((department) => (
            <Chip
              key={department}
              variant="ghost"
              size="sm"
              value={department}
              className={`px-1.5 ${getColor("department", department)}`}
              color="gray"
              onClick={() => handleOptionSelect("department", department)}
            />
          ))}
        </div>
      </DialogBody>
      <DialogFooter className="flex justify-between ">
        <Button variant="text" className="p-0" color="gray" onClick={handleClearAll}>
          Clear All
        </Button>
        <div>
          <Button variant="text" color="red" onClick={handleOpen}>
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="green" onClick={handleApplyFilters}>
            <span>Confirm</span>
          </Button>
        </div>
      </DialogFooter>
    </Dialog>
  );
}

export default FilterDialog;

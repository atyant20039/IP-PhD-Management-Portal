import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Chip,
} from "@material-tailwind/react";

function FilterDialog({ isOpen, setOpen, member, onApplyFilters }) {
  const handleOpen = () => setOpen(!isOpen);

  // Sample options
  const genderOptions = ["Male", "Female", "Other"];
  const departmentOptions = ["CSE", "CB", "ECE", "HCD", "SSH", "MATHS"];
  const studentStatusOptions = [
    "Active",
    "Terminated",
    "Semester Leave",
    "Shifted",
    "Graduated",
  ];
  const fundingOptions = ["Institute", "Sponsored", "Others"];
  const admissionThroughOptions = [
    "Regular",
    "Rolling",
    "Sponsored",
    "Migrated",
    "Direct",
  ];
  const regionOptions = ["Delhi", "Outside Delhi"];

  // State to track selected options
  const [selectedOptions, setSelectedOptions] = useState({
    gender: "",
    department: "",
    studentStatus: "",
    fundingType: "",
    admissionThrough: "",
    region: "",
  });

  // Function to handle selecting or deselecting an option
  const handleOptionSelect = (optionType, optionValue) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [optionType]: prevOptions[optionType] === optionValue ? "" : optionValue,
    }));
  };

  // Function to determine color based on selection
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
      department: "",
      studentStatus: "",
      fundingType: "",
      admissionThrough: "",
      region: "",
    });
  };

  return (
    <Dialog open={isOpen} handler={handleOpen}>
      <DialogHeader>Filter {member}</DialogHeader>
      <DialogBody>
        {/* Option chips */}
        {/* Gender */}
        <div className="text-sm text-blue-gray-500 mb-2">Genders:</div>
        <div className="flex flex-wrap gap-2 mb-2">
          {genderOptions.map((gender) => (
            <Chip
              key={gender}
              variant="ghost"
              size="sm"
              value={gender}
              className={`px-1.5 ${getColor("gender", gender)}`}
              color={
                gender === "Male" ? "blue" : gender === "Female" ? "pink" : "gray"
              }
              onClick={() => handleOptionSelect("gender", gender)}
            />
          ))}
        </div>

        {/* Departments */}
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

        {/* Student Status */}
        <div className="text-sm text-blue-gray-500 mb-2">Student Status:</div>
        <div className="flex flex-wrap gap-2 mb-2">
          {studentStatusOptions.map((status) => (
            <Chip
              key={status}
              variant="ghost"
              size="sm"
              value={status}
              className={`px-1.5 ${getColor("studentStatus", status)}`}
              color={
                status === "Active"
                  ? "green"
                  : status === "Terminated"
                  ? "red"
                  : status === "Semester Leave"
                  ? "amber"
                  : status === "Shifted"
                  ? "blue"
                  : status === "Graduated"
                  ? "gray"
                  : "blue-gray"
              }
              onClick={() => handleOptionSelect("studentStatus", status)}
            />
          ))}
        </div>

        {/* Funding Types */}
        <div className="text-sm text-blue-gray-500 mb-2">Funding Types:</div>
        <div className="flex flex-wrap gap-2 mb-2">
          {fundingOptions.map((fundingType) => (
            <Chip
              key={fundingType}
              variant="ghost"
              size="sm"
              value={fundingType}
              className={`px-1.5 ${getColor("fundingType", fundingType)}`}
              color="gray"
              onClick={() => handleOptionSelect("fundingType", fundingType)}
            />
          ))}
        </div>

        {/* Admission Through */}
        <div className="text-sm text-blue-gray-500 mb-2">Admission Through:</div>
        <div className="flex flex-wrap gap-2 mb-2">
          {admissionThroughOptions.map((admissionType) => (
            <Chip
              key={admissionType}
              variant="ghost"
              size="sm"
              value={admissionType}
              className={`px-1.5 ${getColor("admissionThrough", admissionType)}`}
              color="gray"
              onClick={() => handleOptionSelect("admissionThrough", admissionType)}
            />
          ))}
        </div>

        {/* Region */}
        <div className="text-sm text-blue-gray-500 mb-2">Region:</div>
        <div className="flex flex-wrap gap-2 mb-2">
          {regionOptions.map((region) => (
            <Chip
              key={region}
              variant="ghost"
              size="sm"
              value={region}
              className={`px-1.5 ${getColor("region", region)}`}
              color="gray"
              onClick={() => handleOptionSelect("region", region)}
            />
          ))}
        </div>
      </DialogBody>
      <DialogFooter className="flex justify-between">
  <Button variant="text" color="gray" onClick={handleClearAll}>
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



      {/* Clear all button */}
     
    </Dialog>
  );
}

export default FilterDialog;

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import {
  Button,
  Card,
  CardBody,
  Chip,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Typography,
} from "@material-tailwind/react";

import Select from "react-select";

function FilterStudents({ control }) {
  const [advisorLoading, setAdvisorLoading] = useState(false);
  const API = import.meta.env.VITE_BACKEND_URL;
  const [faculty, setFaculty] = useState();

  useEffect(() => {
    async function fetchAllInstructors() {
      try {
        setAdvisorLoading(true);
        const response = await axios.get(`${API}/api/allInstructors/`);
        setFaculty(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setAdvisorLoading(false);
      }
    }
    fetchAllInstructors();
  }, []);

  const availableFilters = [
    {
      variable: "gender",
      header: "Gender",
      options: ["Male", "Female", "Others"],
    },
    {
      variable: "department",
      header: "Department",
      options: ["CSE", "CB", "ECE", "HCD", "SSH", "MATHS"],
    },
    {
      variable: "studentStatus",
      header: "Student Status",
      options: [
        "Active",
        "Terminated",
        "Semester Leave",
        "Shifted",
        "Graduated",
      ],
    },
    {
      variable: "fundingType",
      header: "Funding Type",
      options: ["Institute", "Sponsored", "Others"],
    },
    {
      variable: "admissionThrough",
      header: "Admission Through",
      options: ["Regular", "Rolling", "Sponsored", "Migrated", "Direct"],
    },
    {
      variable: "advisor",
      header: "Advisor",
      options: [
        { value: "", label: "Select Advisor" },
        ...(faculty?.map((option) => ({
          value: option.name,
          label: option.name,
        })) || []),
      ],
    },
    // {
    //   variable: "region",
    //   header: "Region",
    //   options: ["Delhi", "Outside Delhi"],
    // },
  ];

  return (
    <Card shadow={false}>
      <CardBody>
        {availableFilters.map((filterObject) => {
          return filterObject.variable == "advisor" ? (
            <div key={filterObject.variable}>
              <Typography variant="h5" className="cursor-default">
                {filterObject.header}
              </Typography>
              <div>
                <Controller
                  name={filterObject.variable}
                  id={filterObject.variable}
                  control={control}
                  render={({ field }) => (
                    <Select
                      placeholder="Select Advisor"
                      defaultValue={{
                        value: "",
                        label: "Select Advisor",
                      }}
                      isLoading={advisorLoading}
                      options={filterObject.options}
                      menuPlacement="top"
                      {...field}
                    />
                  )}
                />
              </div>
            </div>
          ) : (
            <div key={filterObject.variable}>
              <Typography variant="h5" className="cursor-default">
                {filterObject.header}
              </Typography>
              <div className="flex flex-wrap gap-2 mb-2">
                {filterObject.options.map((optionObject) => (
                  <Controller
                    key={optionObject}
                    name={filterObject.variable}
                    control={control}
                    render={({ field }) => (
                      <Chip
                        variant="ghost"
                        size="sm"
                        value={optionObject}
                        className={`px-1.5 cursor-pointer ${
                          field.value === optionObject ? "bg-green-500" : ""
                        }`}
                        color="gray"
                        onClick={() =>
                          field.onChange(
                            field.value === optionObject ? "" : optionObject
                          )
                        }
                      >
                        {optionObject}
                      </Chip>
                    )}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
}

function FilterProfessors({ control }) {
  const availableFilters = [
    {
      variable: "department",
      header: "Department",
      options: ["CSE", "CB", "ECE", "HCD", "SSH", "MATHS"],
    },
  ];

  return (
    <Card shadow={false}>
      <CardBody>
        {availableFilters.map((filterObject) => (
          <div key={filterObject.variable}>
            <Typography variant="h5" className="cursor-default">
              {filterObject.header}
            </Typography>
            <div className="flex flex-wrap gap-2 mb-2">
              {filterObject.options.map((optionObject) => (
                <Controller
                  key={optionObject}
                  name={filterObject.variable}
                  control={control}
                  render={({ field }) => (
                    <Chip
                      variant="ghost"
                      size="sm"
                      value={optionObject}
                      className={`px-1.5 cursor-pointer ${
                        field.value === optionObject ? "bg-green-500" : ""
                      }`}
                      color="gray"
                      onClick={() =>
                        field.onChange(
                          field.value === optionObject ? "" : optionObject
                        )
                      }
                    >
                      {optionObject}
                    </Chip>
                  )}
                />
              ))}
            </div>
          </div>
        ))}
      </CardBody>
    </Card>
  );
}

function FilterDialog({ isOpen, setOpen, member, onApplyFilters }) {
  const handleOpen = () => setOpen(!isOpen);

  const studentDefaultValues = {
    gender: "",
    department: "",
    studentStatus: "",
    fundingType: "",
    admissionThrough: "",
    region: "",
    advisor: "",
  };

  const professorDefaultValues = {
    department: "",
  };

  const { control, handleSubmit, reset } = useForm({
    defaultValues:
      member === "Students" ? studentDefaultValues : professorDefaultValues,
  });

  const onSubmit = (data) => {
    if (data.advisor) {
      data.advisor =
        typeof data.advisor == "object" ? data.advisor.value : data.advisor;
    }
    onApplyFilters(data);
    handleOpen();
  };

  const clearAll = () => {
    reset(
      member === "Students" ? studentDefaultValues : professorDefaultValues
    );
  };

  return (
    <Dialog open={isOpen} handler={handleOpen} dismiss={{ enabled: false }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogHeader className="cursor-default">Filter {member}</DialogHeader>
        <DialogBody>
          {member == "Students" ? (
            <FilterStudents control={control} />
          ) : member == "Professors" ? (
            <FilterProfessors control={control} />
          ) : null}
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={clearAll}
            className="mr-1"
          >
            <span>Clear All</span>
          </Button>
          <Button variant="gradient" color="green" type="submit">
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}

export default FilterDialog;

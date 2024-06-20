import React, { useContext, useEffect } from "react";

import
  {
    Alert,
    Button,
    Card,
    CardBody,
    Dialog,
    DialogBody,
    DialogFooter,
    DialogHeader,
    Input,
    Spinner,
  } from "@material-tailwind/react";

import Select from "react-select";

import { Controller, useForm } from "react-hook-form";
import FacultyContext from "../context/FacultyContext";

function ProfessorDialog({ isOpen, setOpen, initVal }) {
  const { addFaculty, updateFaculty } = useContext(FacultyContext);
  const formOptions = {
    departmentOptions: [
      { value: "CSE", label: "CSE" },
      { value: "CB", label: "CB" },
      { value: "HCD", label: "HCD" },
      { value: "MATHS", label: "MATHS" },
      { value: "SSH", label: "SSH" },
      { value: "ECE", label: "ECE" },
    ],
  };

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (initVal) {
      setValue("name", initVal.name);
      setValue("emailId", initVal.emailId);
      setValue(
        "department",
        formOptions.departmentOptions.find(
          (option) => option.value === initVal.department
        )
      );
    }
  }, [initVal, setValue]);

  const onSubmit = async (data) => {
    var response;

    data["department"] = data["department"].value;

    if (initVal) {
      response = await updateFaculty(initVal.id, data);
    } else {
      response = await addFaculty(data);
    }

    if (response) {
      setError("root", {
        type: "manual",
        message: response,
      });
    } else {
      handleCancel();
    }
  };

  const handleCancel = () => {
    setOpen(false);
    reset();
  };

  return (
    <Dialog open={isOpen} handler={handleCancel}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogHeader className="cursor-default">
          {initVal ? "Edit" : "Add"} Professor
        </DialogHeader>
        <DialogBody>
          <Card shadow={false}>
            <CardBody>
              <div className="mb-4">
                <label htmlFor="name">Name*</label>
                <Input
                  type="text"
                  id="name"
                  error={Boolean(errors.name)}
                  {...register("name", {
                    required: "Name is required",
                    maxLength: {
                      value: 255,
                      message: "Name cannot exceed 255 characters",
                    },
                  })}
                />
                {errors.name && (
                  <span className="text-red-500">{errors.name.message}</span>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="emailId">Email Id*</label>
                <Input
                  type="email"
                  id="emailId"
                  error={Boolean(errors.emailId)}
                  {...register("emailId", {
                    required: "Email is required",
                    maxLength: {
                      value: 255,
                      message: "Email cannot exceed 255 characters",
                    },
                    // pattern: {
                    //   value: /^[^@]+@iiitd\.ac\.in$/,
                    //   message: "Email must be of the domain iiitd.ac.in",
                    // },
                  })}
                />
                {errors.emailId && (
                  <span className="text-red-500">{errors.emailId.message}</span>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="department">Department*</label>
                <Controller
                  name="department"
                  id="department"
                  control={control}
                  rules={{ required: "Department is required" }}
                  render={({ field }) => (
                    <Select
                      options={formOptions.departmentOptions}
                      error={Boolean(errors.department)}
                      {...field}
                    />
                  )}
                />
                {errors.department && (
                  <span className="text-red-500">
                    {errors.department.message}
                  </span>
                )}
              </div>
              {errors.root && (
                <Alert variant="ghost" color="red" className="text-red-500">
                  {errors.root.message}
                </Alert>
              )}
            </CardBody>
          </Card>
        </DialogBody>
        <DialogFooter>
          {isSubmitting ? (
            <Spinner className="size-10" />
          ) : (
            <div>
              <Button
                variant="text"
                color="red"
                className="mr-1"
                onClick={handleCancel}
              >
                <span>Cancel</span>
              </Button>
              <Button variant="gradient" color="green" type="submit">
                <span>Confirm</span>
              </Button>
            </div>
          )}
        </DialogFooter>
      </form>
    </Dialog>
  );
}

export default ProfessorDialog;

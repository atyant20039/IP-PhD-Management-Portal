import React, { useContext, useEffect } from "react";

import {
  Alert,
  Button,
  Card,
  CardBody,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Option,
  Select,
  Spinner,
} from "@material-tailwind/react";

import { Controller, useForm } from "react-hook-form";
import FacultyContext from "../context/FacultyContext";

function ProfessorDialog({ isOpen, setOpen, initVal }) {
  const { addFaculty, updateFaculty } = useContext(FacultyContext);

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
      setValue("department", initVal.department);
    }
  }, [initVal, setValue]);

  const onSubmit = async (data) => {
    var response;

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
        <DialogHeader>{initVal ? "Edit" : "Add"} Professor</DialogHeader>
        <DialogBody>
          <Card shadow={false}>
            <CardBody>
              <div className="mb-4">
                <Input
                  type="text"
                  id="name"
                  label="Name*"
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
                <Input
                  type="email"
                  id="emailId"
                  label="Email Id*"
                  error={Boolean(errors.emailId)}
                  {...register("emailId", {
                    required: "Email is required",
                    maxLength: {
                      value: 255,
                      message: "Email cannot exceed 255 characters",
                    },
                    pattern: {
                      value: /^[^@]+@iiitd\.ac\.in$/,
                      message: "Email must be of the domain iiitd.ac.in",
                    },
                  })}
                />
                {errors.emailId && (
                  <span className="text-red-500">{errors.emailId.message}</span>
                )}
              </div>
              <div className="mb-4">
                <Controller
                  name="department"
                  id="department"
                  control={control}
                  rules={{ required: "Department is required" }}
                  render={({ field }) => (
                    <Select
                      label="Department*"
                      error={Boolean(errors.department)}
                      {...field}
                    >
                      <Option value="CSE">CSE</Option>
                      <Option value="CB">CB</Option>
                      <Option value="HCD">HCD</Option>
                      <Option value="MATHS">MATHS</Option>
                      <Option value="SSH">SSH</Option>
                      <Option value="ECE">ECE</Option>
                    </Select>
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

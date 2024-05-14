import React, { useEffect } from "react";

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
  Spinner,
} from "@material-tailwind/react";

import axios from "axios";
import { useForm } from "react-hook-form";

const validateFileType = (value) => {
  if (value.length == 0) return true;
  if (!value[0].name.match(/\.(pdf|doc|docx)$/i)) {
    return "Only PDF, DOC, and DOCX files are allowed";
  }
};

function ComprehensiveDialog({ isOpen, setOpen, initVal, studentId }) {
  const API = import.meta.env.VITE_BACKEND_URL;
  const addCompre = async (data) => {
    try {
      await axios.post(`${API}/api/comprehensive/`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      Error = error.response?.data
        ? Object.values(error.response.data)
        : [error.message];
      return Error;
    }
  };

  const updateCompre = async (id, data) => {
    try {
      await axios.patch(`${API}/api/comprehensive/${id}/`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      Error = error.response?.data
        ? Object.values(error.response.data)
        : [error.message];
      return Error;
    }
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
      setValue(
        "dateOfReview",
        initVal.dateOfReview.split("-").reverse().join("-")
      );
      initVal.comment ? setValue("comment", initVal.comment) : null;
    }
  }, [initVal, setValue]);

  const onSubmit = async (data) => {
    var response;

    if (data.dateOfReview) {
      const date = new Date(data.dateOfReview);
      const day = ("0" + date.getDate()).slice(-2);
      const month = ("0" + (date.getMonth() + 1)).slice(-2);
      const year = date.getFullYear();
      data.dateOfReview = `${day}-${month}-${year}`;
    } else {
      delete data.dateOfReview;
    }

    data.student = studentId;

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === "comprehensiveReviewFile") {
        if (data[key].length != 0 && data[key][0] instanceof File) {
          formData.append(key, data[key][0]);
        }
      } else {
        formData.append(key, data[key]);
      }
    });

    if (initVal) {
      response = await updateCompre(initVal.id, formData);
    } else {
      response = await addCompre(formData);
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
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <DialogHeader className="cursor-default">
          {initVal ? "Edit" : "Add"} Comprehensive Exam Review
        </DialogHeader>
        <DialogBody>
          <Card shadow={false}>
            <CardBody>
              <div className="mb-4">
                <label htmlFor="dateOfReview">Date of Review*</label>
                <Input
                  type="date"
                  id="dateOfReview"
                  error={Boolean(errors.dateOfReview)}
                  {...register("dateOfReview", {
                    required: "Date of Review is required",
                  })}
                />
                {errors.dateOfReview && (
                  <span className="text-red-500">
                    {errors.dateOfReview.message}
                  </span>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="comment">Comment</label>
                <Input
                  type="text"
                  id="comment"
                  error={Boolean(errors.comment)}
                  {...register("comment")}
                />
                {errors.comment && (
                  <span className="text-red-500">{errors.comment.message}</span>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="comprehensiveReviewFile">
                  Comprehensive Exam Review File*
                </label>
                {initVal && (
                  <div>
                    Current File:{" "}
                    {initVal.comprehensiveReviewFile.split("/").pop()}
                  </div>
                )}
                <input
                  type="file"
                  id="comprehensiveReviewFile"
                  className="file:rounded-lg file:rounded-r-none rounded-lg border border-blue-gray-200 file:bg-white text-blue-gray-400 file:text-blue-gray-400 file:mr-2 file:px-3 file:py-1 file:border-transparent file:border-r file:border-r-blue-gray-200 w-full cursor-pointer file:hover:cursor-pointer"
                  {...register("comprehensiveReviewFile", {
                    required: initVal
                      ? false
                      : "Comprehensive Exam Review File is required",
                    validate: initVal ? null : validateFileType,
                  })}
                />
                {errors.comprehensiveReviewFile && (
                  <span className="text-red-500">
                    {errors.comprehensiveReviewFile.message}
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

export default ComprehensiveDialog;

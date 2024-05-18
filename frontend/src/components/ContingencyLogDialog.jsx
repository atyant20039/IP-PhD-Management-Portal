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

// const validateFileType = (value) => {
//   if (value.length == 0) return true;
//   if (!value[0].name.match(/\.(pdf|doc|docx)$/i)) {
//     return "Only PDF, DOC, and DOCX files are allowed";
//   }
// };

function ContingencyLogDialog({ isOpen, setOpen, initVal, studentId }) {
  const API = import.meta.env.VITE_BACKEND_URL;
  const addCLog = async (data) => {
    try {
      await axios.post(
        `${API}/api/contingencyLogs/`,
        data
        //   , {
        //     headers: {
        //       "Content-Type": "multipart/form-data",
        //     },
        //   }
      );
    } catch (error) {
      var Error = error.response?.data
        ? Object.values(error.response.data)
        : [error.message];
      return Error;
    }
  };

  const updateCLog = async (id, data) => {
    try {
      await axios.patch(
        `${API}/api/contingencyLogs/${id}/`,
        data
        //   , {
        //     headers: {
        //       "Content-Type": "multipart/form-data",
        //     },
        //   }
      );
    } catch (error) {
      var Error = error.response?.data
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
      setValue("item", initVal.item);
      setValue("quantity", initVal.quantity);
      setValue("price", initVal.price);
      setValue("source", initVal.source);
      setValue("credit", initVal.credit);
      setValue("claimAmount", initVal.claimAmount);
      initVal.santionedAmount
        ? setValue("santionedAmount", initVal.santionedAmount)
        : null;
      initVal.forwardedBy ? setValue("forwardedBy", initVal.forwardedBy) : null;
      initVal.forwardedOnDate
        ? setValue(
            "forwardedOnDate",
            initVal.forwardedOnDate.split("-").reverse().join("-")
          )
        : null;
      setValue("openingBalance", initVal.openingBalance);
      initVal.closingBalance
        ? setValue("closingBalance", initVal.closingBalance)
        : null;
      setValue(
        "openingBalanceDate",
        initVal.openingBalanceDate.split("-").reverse().join("-")
      );
      initVal.closingBalanceDate
        ? setValue(
            "closingBalanceDate",
            initVal.closingBalanceDate.split("-").reverse().join("-")
          )
        : null;
      initVal.comment ? setValue("comment", initVal.comment) : null;
    }
  }, [initVal, setValue]);

  const onSubmit = async (data) => {
    var response;

    if (data.forwardedOnDate) {
      const date = new Date(data.forwardedOnDate);
      const day = ("0" + date.getDate()).slice(-2);
      const month = ("0" + (date.getMonth() + 1)).slice(-2);
      const year = date.getFullYear();
      data.forwardedOnDate = `${day}-${month}-${year}`;
    } else {
      delete data.forwardedOnDate;
    }
    if (data.openingBalanceDate) {
      const date = new Date(data.openingBalanceDate);
      const day = ("0" + date.getDate()).slice(-2);
      const month = ("0" + (date.getMonth() + 1)).slice(-2);
      const year = date.getFullYear();
      data.openingBalanceDate = `${day}-${month}-${year}`;
    } else {
      delete data.openingBalanceDate;
    }
    if (data.closingBalanceDate) {
      const date = new Date(data.closingBalanceDate);
      const day = ("0" + date.getDate()).slice(-2);
      const month = ("0" + (date.getMonth() + 1)).slice(-2);
      const year = date.getFullYear();
      data.closingBalanceDate = `${day}-${month}-${year}`;
    } else {
      delete data.closingBalanceDate;
    }

    data.student = studentId;

    // const formData = new FormData();
    // Object.keys(data).forEach((key) => {
    //   if (key === "comprehensiveReviewFile") {
    //     if (data[key].length != 0 && data[key][0] instanceof File) {
    //       formData.append(key, data[key][0]);
    //     }
    //   } else {
    //     formData.append(key, data[key]);
    //   }
    // });

    if (initVal) {
      response = await updateCLog(initVal.id, data);
    } else {
      response = await addCLog(data);
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
    <Dialog open={isOpen} handler={handleCancel} className="max-h-[90vh]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        //  encType="multipart/form-data"
      >
        <DialogHeader className="cursor-default max-h-[10vh]">
          {initVal ? "Edit" : "Add"} Contingency Log
        </DialogHeader>
        <DialogBody className="max-h-[60vh] mb-4 overflow-y-auto">
          <Card shadow={false}>
            <CardBody className="grid grid-cols-2 gap-3">
              <div className="mb-4 col-span-2">
                <label htmlFor="item">Item*</label>
                <Input
                  type="text"
                  id="item"
                  error={Boolean(errors.item)}
                  {...register("item", {
                    required: "Item is required",
                  })}
                />
                {errors.item && (
                  <span className="text-red-500">{errors.item.message}</span>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="quantity">Quantity*</label>
                <Input
                  type="number"
                  id="quantity"
                  error={Boolean(errors.quantity)}
                  defaultValue={1}
                  {...register("quantity", {
                    required: "Quantity is required",
                    min: {
                      value: 0,
                      message: "Quantity can't be negative",
                    },
                    valueAsNumber: true,
                  })}
                />
                {errors.quantity && (
                  <span className="text-red-500">
                    {errors.quantity.message}
                  </span>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="price">Price*</label>
                <Input
                  type="number"
                  id="price"
                  step="0.01"
                  error={Boolean(errors.price)}
                  {...register("price", {
                    required: "Price is required",
                    min: { value: 0, message: "Price cannot be negative" },
                    valueAsNumber: true,
                  })}
                />
                {errors.price && (
                  <span className="text-red-500">{errors.price.message}</span>
                )}
              </div>
              <div className="mb-4 col-span-2">
                <label htmlFor="source">Source*</label>
                <Input
                  type="text"
                  id="source"
                  error={Boolean(errors.source)}
                  {...register("source", {
                    required: "Source is required",
                  })}
                />
                {errors.source && (
                  <span className="text-red-500">{errors.source.message}</span>
                )}
              </div>
              <div className="mb-4 col-span-2">
                <label htmlFor="credit">Credit*</label>
                <Input
                  type="text"
                  id="credit"
                  error={Boolean(errors.credit)}
                  {...register("credit", {
                    required: "Credit is required",
                  })}
                />
                {errors.credit && (
                  <span className="text-red-500">{errors.credit.message}</span>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="claimAmount">Claim Amount*</label>
                <Input
                  type="number"
                  id="claimAmount"
                  step="0.01"
                  error={Boolean(errors.claimAmount)}
                  {...register("claimAmount", {
                    required: "Claim Amount is required",
                    min: {
                      value: 0,
                      message: "Claim Amount cannot be negative",
                    },
                    valueAsNumber: true,
                  })}
                />
                {errors.claimAmount && (
                  <span className="text-red-500">
                    {errors.claimAmount.message}
                  </span>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="santionedAmount">Santioned Amount</label>
                <Input
                  type="number"
                  id="santionedAmount"
                  step="0.01"
                  error={Boolean(errors.santionedAmount)}
                  {...register("santionedAmount", {
                    min: {
                      value: 0,
                      message: "Santioned Amount cannot be negative",
                    },
                    valueAsNumber: true,
                  })}
                />
                {errors.santionedAmount && (
                  <span className="text-red-500">
                    {errors.santionedAmount.message}
                  </span>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="forwardedBy">Forwarded By</label>
                <Input
                  type="text"
                  id="forwardedBy"
                  error={Boolean(errors.forwardedBy)}
                  {...register("forwardedBy")}
                />
                {errors.forwardedBy && (
                  <span className="text-red-500">
                    {errors.forwardedBy.message}
                  </span>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="forwardedOnDate">Forwarded On</label>
                <Input
                  type="date"
                  id="forwardedOnDate"
                  error={Boolean(errors.forwardedOnDate)}
                  {...register("forwardedOnDate")}
                />
                {errors.forwardedOnDate && (
                  <span className="text-red-500">
                    {errors.forwardedOnDate.message}
                  </span>
                )}
              </div>
              {/* <div className="mb-4">
                <label htmlFor="openingBalance">Opening Balance*</label>
                <Input
                  type="number"
                  step="0.01"
                  id="openingBalance"
                  error={Boolean(errors.openingBalance)}
                  {...register("openingBalance", {
                    required: "Opening Balance is required",
                    min: {
                      value: 0,
                      message: "Opening Balance cannot be negative",
                    },
                    valueAsNumber: true,
                  })}
                />
                {errors.openingBalance && (
                  <span className="text-red-500">
                    {errors.openingBalance.message}
                  </span>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="closingBalance">Closing Balance</label>
                <Input
                  type="number"
                  step="0.01"
                  id="closingBalance"
                  error={Boolean(errors.closingBalance)}
                  {...register("closingBalance", {
                    min: {
                      value: 0,
                      message: "Closing Balance cannot be negative",
                    },
                    valueAsNumber: true,
                  })}
                />
                {errors.closingBalance && (
                  <span className="text-red-500">
                    {errors.closingBalance.message}
                  </span>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="openingBalanceDate">Opening Balance Date</label>
                <Input
                  type="date"
                  id="openingBalanceDate"
                  error={Boolean(errors.openingBalanceDate)}
                  {...register("openingBalanceDate")}
                />
                {errors.openingBalanceDate && (
                  <span className="text-red-500">
                    {errors.openingBalanceDate.message}
                  </span>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="closingBalanceDate">Closing Balance Date</label>
                <Input
                  type="date"
                  id="closingBalanceDate"
                  error={Boolean(errors.closingBalanceDate)}
                  {...register("closingBalanceDate")}
                />
                {errors.closingBalanceDate && (
                  <span className="text-red-500">
                    {errors.closingBalanceDate.message}
                  </span>
                )}
              </div> */}
              <div className="mb-4 col-span-2">
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
              {/* <div className="mb-4">
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
              </div> */}
              {errors.root && (
                <Alert
                  variant="ghost"
                  color="red"
                  className="text-red-500 col-span-2"
                >
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

export default ContingencyLogDialog;

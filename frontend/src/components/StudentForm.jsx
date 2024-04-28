import {
  Alert,
  Button,
  Card,
  CardBody,
  CardFooter,
  Input,
  Spinner,
} from "@material-tailwind/react";
import React, { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import FacultyContext from "../context/FacultyContext";
import StudentContext from "../context/StudentContext";

function StudentForm({ setOpen, initVal }) {
  const { addStudent, updateStudent } = useContext(StudentContext);
  const { faculty, fetchData } = useContext(FacultyContext);
  const [advisorSearch, setAdvisorSearch] = useState("");
  const [advisorLoading, setAdvisorLoading] = useState(false);

  const getBatch = (batchMonth, batchYear) => {
    return `${batchMonth} ${batchYear}`;
  };

  const getBatchMonth = (batch) => {
    return batch.split(" ")[0];
  };

  const getBatchYear = (batch) => {
    return batch.split(" ")[1];
  };

  const validateRollNumber = (value) => {
    if (value.startsWith("PhD")) {
      if (!value.substring(3).match(/^\d+$/) || value.length < 8) {
        return "Please use the following roll number format: PhDxxxxx";
      }
    } else if (value.startsWith("MT")) {
      if (!value.substring(2).match(/^\d+$/) || value.length < 7) {
        return "Please use the following roll number format: MTxxxxx";
      }
    } else {
      return "Please use the following roll number format: PhDxxxxx or MTxxxxx";
    }
    return true;
  };

  useEffect(() => {
    setAdvisorLoading(true);
    const delay = 500;
    const timer = setTimeout(() => {
      fetchData(1, advisorSearch, "name", setAdvisorLoading, {});
    }, delay);
    return () => clearTimeout(timer);
  }, [advisorSearch]);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      advisor1_emailId: "null@iiitd.ac.in",
      advisor2_emailId: "null@iiitd.ac.in",
      coadvisor_emailId: "null@iiitd.ac.in",
    },
  });

  useEffect(() => {
    if (initVal) {
      setValue("rollNumber", initVal.rollNumber);
      setValue("name", initVal.name);
      setValue("emailId", initVal.emailId);
      setValue("gender", initVal.gender);
      setValue("department", initVal.department);
      setValue("joiningDate", initVal.joiningDate);
      setValue("batchMonth", getBatchMonth(initVal.batch));
      setValue("batchYear", getBatchYear(initVal.batch));
      initVal.educationalQualification
        ? setValue("educationalQualification", initVal.educationalQualification)
        : null;
      initVal.region ? setValue("region", initVal.region) : null;
      setValue("admissionThrough", initVal.admissionThrough);
      setValue("fundingType", initVal.fundingType);
      initVal.sourceOfFunding
        ? setValue("sourceOfFunding", initVal.sourceOfFunding)
        : null;
      setValue("contingencyPoints", initVal.contingencyPoints);
      setValue("studentStatus", initVal.studentStatus);
      initVal.thesisSubmissionDate
        ? setValue("thesisSubmissionDate", initVal.thesisSubmissionDate)
        : null;
      initVal.thesisDefenceDate
        ? setValue("thesisDefenceDate", initVal.thesisDefenceDate)
        : null;
      initVal.yearOfLeaving
        ? setValue("yearOfLeaving", initVal.yearOfLeaving)
        : null;
      initVal.comment ? setValue("comment", initVal.comment) : null;
      setValue(
        "advisor1_emailId",
        initVal.advisor1 ? initVal.advisor1 : "null@iiitd.ac.in"
      );
      setValue(
        "advisor2_emailId",
        initVal.advisor2 ? initVal.advisor2 : "null@iiitd.ac.in"
      );
      setValue(
        "coadvisor_emailId",
        initVal.coadvisor ? initVal.coadvisor : "null@iiitd.ac.in"
      );
    }
  }, [initVal, setValue]);

  const onSubmit = async (data) => {
    var response;

    data.batch = getBatch(data.batchMonth.value, data.batchYear);
    delete data.batchMonth;
    delete data.batchYear;

    [
      "gender",
      "department",
      "admissionThrough",
      "fundingType",
      "studentStatus",
    ].map((key) => (data[key] = data[key].value));

    data.region = data.region ? data.region.value : null;

    ["joiningDate", "thesisSubmissionDate", "thesisDefenceDate"].map(
      (inputDate) => {
        if (data[inputDate]) {
          const date = new Date(data[inputDate]);
          const day = ("0" + date.getDate()).slice(-2);
          const month = ("0" + (date.getMonth() + 1)).slice(-2);
          const year = date.getFullYear();
          data[inputDate] = `${day}-${month}-${year}`;
        } else {
          delete data[inputDate];
        }
      }
    );

    data.advisor1_emailId =
      typeof data.advisor1_emailId == "object"
        ? data.advisor1_emailId.value
        : data.advisor1_emailId;
    data.advisor2_emailId =
      typeof data.advisor2_emailId == "object"
        ? data.advisor2_emailId.value
        : data.advisor2_emailId;
    data.coadvisor_emailId =
      typeof data.coadvisor_emailId == "object"
        ? data.coadvisor_emailId.value
        : data.coadvisor_emailId;

    if (initVal) {
      response = await updateStudent(initVal.rollNumber, data);
    } else {
      response = await addStudent(data);
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
    <Card shadow={false}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardBody className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <Input
              type="text"
              id="rollNumber"
              label="Roll Number*"
              error={Boolean(errors.rollNumber)}
              {...register("rollNumber", {
                required: "Roll Number is required",
                maxLength: {
                  value: 10,
                  message: "Roll Number cannot exceed 10 characters",
                },
                validate: validateRollNumber,
              })}
            />
            {errors.rollNumber && (
              <span className="text-red-500">{errors.rollNumber.message}</span>
            )}
          </div>
          <div className="col-span-2">
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
          <div className="col-span-2">
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
          <div>
            <Controller
              name="gender"
              id="gender"
              control={control}
              rules={{ required: "Gender is required" }}
              render={({ field }) => (
                <Select
                  placeholder="Gender*"
                  options={[
                    { value: "Male", label: "Male" },
                    { value: "Female", label: "Female" },
                    { value: "Others", label: "Others" },
                  ]}
                  error={Boolean(errors.gender)}
                  {...field}
                />
              )}
            />
            {errors.gender && (
              <span className="text-red-500">{errors.gender.message}</span>
            )}
          </div>
          <div>
            <Controller
              name="department"
              id="department"
              control={control}
              rules={{ required: "Department is required" }}
              render={({ field }) => (
                <Select
                  placeholder="Department*"
                  options={[
                    { value: "CSE", label: "CSE" },
                    { value: "CB", label: "CB" },
                    { value: "HCD", label: "HCD" },
                    { value: "MATHS", label: "MATHS" },
                    { value: "SSH", label: "SSH" },
                    { value: "ECE", label: "ECE" },
                  ]}
                  error={Boolean(errors.department)}
                  {...field}
                />
              )}
            />
            {errors.department && (
              <span className="text-red-500">{errors.department.message}</span>
            )}
          </div>
          <div>
            <Controller
              name="region"
              id="region"
              control={control}
              render={({ field }) => (
                <Select
                  placeholder="Region"
                  isClearable
                  backspaceRemovesValue
                  options={[
                    { value: "Delhi", label: "Delhi" },
                    { value: "Outside Delhi", label: "Outside Delhi" },
                  ]}
                  error={Boolean(errors.region)}
                  {...field}
                />
              )}
            />
            {errors.region && (
              <span className="text-red-500">{errors.region.message}</span>
            )}
          </div>
          <div>
            <Input
              type="date"
              id="joiningDate"
              label="Joining Date*"
              error={Boolean(errors.joiningDate)}
              {...register("joiningDate", {
                required: "Joining Date is required",
              })}
            />
            {errors.joiningDate && (
              <span className="text-red-500">{errors.joiningDate.message}</span>
            )}
          </div>
          <div>
            <Controller
              name="batchMonth"
              id="batchMonth"
              control={control}
              rules={{ required: "Batch Month is required" }}
              render={({ field }) => (
                <Select
                  placeholder="Batch Month*"
                  options={[
                    { value: "January", label: "January" },
                    { value: "February", label: "February" },
                    { value: "March", label: "March" },
                    { value: "April", label: "April" },
                    { value: "May", label: "May" },
                    { value: "June", label: "June" },
                    { value: "July", label: "July" },
                    { value: "August", label: "August" },
                    { value: "September", label: "September" },
                    { value: "October", label: "October" },
                    { value: "November", label: "November" },
                    { value: "December", label: "December" },
                  ]}
                  error={Boolean(errors.batchMonth)}
                  {...field}
                />
              )}
            />
            {errors.batchMonth && (
              <span className="text-red-500">{errors.batchMonth.message}</span>
            )}
          </div>
          <div>
            <Input
              type="number"
              id="batchYear"
              label="Batch Year*"
              error={Boolean(errors.batchYear)}
              {...register("batchYear", {
                required: "Batch Year is required",
                min: {
                  value: 2000,
                  message: "Year must be at least 2000",
                },
                valueAsNumber: true,
              })}
            />
            {errors.batchYear && (
              <span className="text-red-500">{errors.batchYear.message}</span>
            )}
          </div>

          <div className="col-span-2">
            <Input
              type="text"
              id="educationalQualification"
              label="Educational Qualification"
              error={Boolean(errors.educationalQualification)}
              {...register("educationalQualification", {
                maxLength: {
                  value: 255,
                  message:
                    "Educational Qualification cannot exceed 255 characters",
                },
              })}
            />
            {errors.educationalQualification && (
              <span className="text-red-500">
                {errors.educationalQualification.message}
              </span>
            )}
          </div>
          <div>
            <Controller
              name="admissionThrough"
              id="admissionThrough"
              control={control}
              rules={{ required: "Admission Through is required" }}
              render={({ field }) => (
                <Select
                  placeholder="Admission Through*"
                  options={[
                    { value: "Regular", label: "Regular" },
                    { value: "Rolling", label: "Rolling" },
                    { value: "Sponsored", label: "Sponsored" },
                    { value: "Migrated", label: "Migrated" },
                    { value: "Direct", label: "Direct" },
                  ]}
                  error={Boolean(errors.admissionThrough)}
                  {...field}
                />
              )}
            />
            {errors.admissionThrough && (
              <span className="text-red-500">
                {errors.admissionThrough.message}
              </span>
            )}
          </div>
          <div>
            <Controller
              name="fundingType"
              id="fundingType"
              control={control}
              rules={{ required: "Funding Type is required" }}
              render={({ field }) => (
                <Select
                  placeholder="Funding Type*"
                  options={[
                    { value: "Institute", label: "Institute" },
                    { value: "Sponsored", label: "Sponsored" },
                    { value: "Others", label: "Others" },
                  ]}
                  error={Boolean(errors.fundingType)}
                  {...field}
                />
              )}
            />
            {errors.fundingType && (
              <span className="text-red-500">{errors.fundingType.message}</span>
            )}
          </div>
          <div className="col-span-2">
            <Input
              type="text"
              id="sourceOfFunding"
              label="Source Of Funding"
              error={Boolean(errors.sourceOfFunding)}
              {...register("sourceOfFunding", {
                maxLength: {
                  value: 255,
                  message: "Source Of Funding cannot exceed 255 characters",
                },
              })}
            />
            {errors.sourceOfFunding && (
              <span className="text-red-500">
                {errors.sourceOfFunding.message}
              </span>
            )}
          </div>
          <div>
            <Input
              type="number"
              id="contingencyPoints"
              label="Contingency Points*"
              error={Boolean(errors.contingencyPoints)}
              defaultValue={20000}
              {...register("contingencyPoints", {
                required: "Contingency Points is required",
                min: {
                  value: 0,
                  message: "Amount must be greater than or equal to 0",
                },
                max: {
                  value: 99999999.99,
                  message: "Amount cannot exceed 99999999.99",
                },
                pattern: {
                  value: /^\d+(\.\d{1,2})?$/,
                  message:
                    "Invalid format. Please enter up to 2 decimal places.",
                },
                valueAsNumber: true,
              })}
            />
            {errors.contingencyPoints && (
              <span className="text-red-500">
                {errors.contingencyPoints.message}
              </span>
            )}
          </div>
          <div>
            <Controller
              name="studentStatus"
              id="studentStatus"
              control={control}
              rules={{ required: "Student Status is required" }}
              render={({ field }) => (
                <Select
                  placeholder="Student Status*"
                  options={[
                    { value: "Active", label: "Active" },
                    { value: "Terminated", label: "Terminated" },
                    { value: "Graduated", label: "Graduated" },
                    { value: "Shifted", label: "Shifted" },
                    { value: "Semester Leave", label: "Semester Leave" },
                  ]}
                  error={Boolean(errors.studentStatus)}
                  {...field}
                />
              )}
            />
            {errors.studentStatus && (
              <span className="text-red-500">
                {errors.studentStatus.message}
              </span>
            )}
          </div>
          <div className="col-span-2">
            <label className="text-gray-500 text-sm" htmlFor="advisor1_emailId">
              Advisor 1
            </label>
            <Controller
              name="advisor1_emailId"
              id="advisor1_emailId"
              control={control}
              render={({ field }) => (
                <Select
                  placeholder="Select Advisor 1"
                  defaultValue={{ value: "null@iiitd.ac.in", label: "None" }}
                  onInputChange={(value) => setAdvisorSearch(value)}
                  isLoading={advisorLoading}
                  options={[
                    { value: "null@iiitd.ac.in", label: "None" },
                    ...(faculty?.results?.map((option) => ({
                      value: option.emailId,
                      label: option.name,
                    })) || []),
                  ]}
                  error={Boolean(errors.advisor1_emailId)}
                  {...field}
                />
              )}
            />
            {errors.advisor1_emailId && (
              <span className="text-red-500">
                {errors.advisor1_emailId.message}
              </span>
            )}
          </div>
          <div className="col-span-2">
            <label className="text-gray-500 text-sm" htmlFor="advisor2_emailId">
              Advisor 2
            </label>
            <Controller
              name="advisor2_emailId"
              id="advisor2_emailId"
              control={control}
              render={({ field }) => (
                <Select
                  placeholder="Select Advisor 2"
                  defaultValue={{ value: "null@iiitd.ac.in", label: "None" }}
                  onInputChange={(value) => setAdvisorSearch(value)}
                  isLoading={advisorLoading}
                  options={[
                    { value: "null@iiitd.ac.in", label: "None" },
                    ...(faculty?.results?.map((option) => ({
                      value: option.emailId,
                      label: option.name,
                    })) || []),
                  ]}
                  error={Boolean(errors.advisor2_emailId)}
                  {...field}
                />
              )}
            />
            {errors.advisor2_emailId && (
              <span className="text-red-500">
                {errors.advisor2_emailId.message}
              </span>
            )}
          </div>
          <div className="col-span-2">
            <label
              className="text-gray-500 text-sm"
              htmlFor="coadvisor_emailId"
            >
              Coadvisor
            </label>
            <Controller
              name="coadvisor_emailId"
              id="coadvisor_emailId"
              control={control}
              render={({ field }) => (
                <Select
                  placeholder="Select Coadvisor"
                  defaultValue={{ value: "null@iiitd.ac.in", label: "None" }}
                  onInputChange={(value) => setAdvisorSearch(value)}
                  isLoading={advisorLoading}
                  options={[
                    { value: "null@iiitd.ac.in", label: "None" },
                    ...(faculty?.results?.map((option) => ({
                      value: option.emailId,
                      label: option.name,
                    })) || []),
                  ]}
                  error={Boolean(errors.coadvisor_emailId)}
                  {...field}
                />
              )}
            />
            {errors.coadvisor_emailId && (
              <span className="text-red-500">
                {errors.coadvisor_emailId.message}
              </span>
            )}
          </div>
          <div>
            <Input
              type="date"
              id="thesisSubmissionDate"
              label="Thesis Submission Date"
              error={Boolean(errors.thesisSubmissionDate)}
              {...register("thesisSubmissionDate")}
            />
            {errors.thesisSubmissionDate && (
              <span className="text-red-500">
                {errors.thesisSubmissionDate.message}
              </span>
            )}
          </div>
          <div>
            <Input
              type="date"
              id="thesisDefenceDate"
              label="Thesis Defence Date"
              error={Boolean(errors.thesisDefenceDate)}
              {...register("thesisDefenceDate")}
            />
            {errors.thesisDefenceDate && (
              <span className="text-red-500">
                {errors.thesisDefenceDate.message}
              </span>
            )}
          </div>
          <div className="col-span-2">
            <Input
              type="number"
              id="yearOfLeaving"
              label="Year of Leaving"
              error={Boolean(errors.yearOfLeaving)}
              {...register("yearOfLeaving", {
                min: {
                  value: 2000,
                  message: "Year must be at least 2000",
                },
                valueAsNumber: true,
              })}
            />
            {errors.yearOfLeaving && (
              <span className="text-red-500">
                {errors.yearOfLeaving.message}
              </span>
            )}
          </div>
          <div className="Student Status col-span-2">
            <Input
              type="text"
              id="comment"
              label="Comment"
              error={Boolean(errors.comment)}
              {...register("comment")}
            />
            {errors.comment && (
              <span className="text-red-500">{errors.comment.message}</span>
            )}
          </div>

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
        <CardFooter className="flex justify-end">
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
        </CardFooter>
      </form>
    </Card>
  );
}

export default StudentForm;

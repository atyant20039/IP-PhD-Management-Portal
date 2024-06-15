import {
  Alert,
  Button,
  Card,
  CardBody,
  CardFooter,
  Input,
  Spinner,
} from "@material-tailwind/react";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import StudentContext from "../context/StudentContext";

function StudentForm({ setOpen, initVal }) {
  const { addStudent, updateStudent } = useContext(StudentContext);
  const [advisorLoading, setAdvisorLoading] = useState(false);
  const API = import.meta.env.VITE_BACKEND_URL;
  const BASE = import.meta.env.VITE_FRONTEND_URL;
  const [faculty, setFaculty] = useState();

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
    async function fetchAllInstructors() {
      try {
        setAdvisorLoading(true);
        const response = await axios.get(`${API}/api/allInstructors/`);
        setFaculty(response.data);
      } catch (error) {
        const myError = error.response?.data
          ? Object.values(error.response.data)
          : [error.message];
        setError("root", {
          type: "manual",
          message: myError,
        });
      } finally {
        setAdvisorLoading(false);
      }
    }
    fetchAllInstructors();
  }, []);

  const formOptions = {
    genderOptions: [
      { value: "Male", label: "Male" },
      { value: "Female", label: "Female" },
      { value: "Others", label: "Others" },
    ],
    departmentOptions: [
      { value: "CSE", label: "CSE" },
      { value: "CB", label: "CB" },
      { value: "HCD", label: "HCD" },
      { value: "MATHS", label: "MATHS" },
      { value: "SSH", label: "SSH" },
      { value: "ECE", label: "ECE" },
    ],
    regionOptions: [
      { value: "Delhi", label: "Delhi" },
      { value: "Outside Delhi", label: "Outside Delhi" },
    ],
    monthOptions: [
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
    ],
    admissionOptions: [
      { value: "Regular", label: "Regular" },
      { value: "Rolling", label: "Rolling" },
      { value: "Sponsored", label: "Sponsored" },
      { value: "Migrated", label: "Migrated" },
      { value: "Direct", label: "Direct" },
    ],
    fundingOptions: [
      { value: "Institute", label: "Institute" },
      { value: "Sponsored", label: "Sponsored" },
      { value: "Others", label: "Others" },
    ],
    statusOptions: [
      { value: "Active", label: "Active" },
      { value: "Terminated", label: "Terminated" },
      { value: "Graduated", label: "Graduated" },
      { value: "Shifted", label: "Shifted" },
      { value: "Semester Leave", label: "Semester Leave" },
    ],
    facultyOptions: [
      { value: "null@iiitd.ac.in", label: "None" },
      ...(faculty?.map((option) => ({
        value: option.emailId,
        label: option.name,
      })) || []),
    ],
  };

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
    if (initVal) {
      setValue("rollNumber", initVal.rollNumber);
      setValue("name", initVal.name);
      setValue("emailId", initVal.emailId);
      setValue(
        "gender",
        formOptions.genderOptions.find(
          (option) => option.value === initVal.gender
        )
      );
      setValue(
        "department",
        formOptions.departmentOptions.find(
          (option) => option.value === initVal.department
        )
      );
      setValue(
        "joiningDate",
        initVal.joiningDate.split("-").reverse().join("-")
      );
      setValue(
        "batchMonth",
        formOptions.monthOptions.find(
          (option) => option.value === getBatchMonth(initVal.batch)
        )
      );
      setValue("batchYear", getBatchYear(initVal.batch));
      initVal.educationalQualification
        ? setValue("educationalQualification", initVal.educationalQualification)
        : null;
      initVal.region
        ? setValue(
            "region",
            formOptions.regionOptions.find(
              (option) => option.value === initVal.region
            )
          )
        : null;
      setValue(
        "admissionThrough",
        formOptions.admissionOptions.find(
          (option) => option.value === initVal.admissionThrough
        )
      );
      setValue(
        "fundingType",
        formOptions.fundingOptions.find(
          (option) => option.value === initVal.fundingType
        )
      );
      initVal.sourceOfFunding
        ? setValue("sourceOfFunding", initVal.sourceOfFunding)
        : null;
      initVal.stipendMonths
        ? setValue("stipendMonths", initVal.stipendMonths)
        : null;
      setValue("contingencyPoints", initVal.contingencyPoints);
      initVal.contingencyYears
        ? setValue("contingencyYears", initVal.contingencyYears)
        : null;
      setValue(
        "studentStatus",
        formOptions.statusOptions.find(
          (option) => option.value === initVal.studentStatus
        )
      );
      initVal.thesisSubmissionDate
        ? setValue(
            "thesisSubmissionDate",
            initVal.thesisSubmissionDate.split("-").reverse().join("-")
          )
        : null;
      initVal.thesisDefenceDate
        ? setValue(
            "thesisDefenceDate",
            initVal.thesisDefenceDate.split("-").reverse().join("-")
          )
        : null;
      initVal.yearOfLeaving
        ? setValue("yearOfLeaving", initVal.yearOfLeaving)
        : null;
      initVal.comment ? setValue("comment", initVal.comment) : null;

      setValue(
        "advisor1_emailId",
        initVal.advisor1
          ? formOptions.facultyOptions.find(
              (option) => option.label === initVal.advisor1
            )
          : { value: "null@iiitd.ac.in", label: "None" }
      );

      setValue(
        "advisor2_emailId",
        initVal.advisor2
          ? formOptions.facultyOptions.find(
              (option) => option.label === initVal.advisor2
            )
          : { value: "null@iiitd.ac.in", label: "None" }
      );
      setValue(
        "coadvisor_emailId",
        initVal.coadvisor
          ? formOptions.facultyOptions.find(
              (option) => option.label === initVal.coadvisor
            )
          : { value: "null@iiitd.ac.in", label: "None" }
      );
    }
  }, [initVal, setValue]);

  useEffect(() => {
    if (initVal) {
      setValue(
        "advisor1_emailId",
        initVal.advisor1
          ? formOptions.facultyOptions.find(
              (option) => option.label === initVal.advisor1
            )
          : { value: "null@iiitd.ac.in", label: "None" }
      );

      setValue(
        "advisor2_emailId",
        initVal.advisor2
          ? formOptions.facultyOptions.find(
              (option) => option.label === initVal.advisor2
            )
          : { value: "null@iiitd.ac.in", label: "None" }
      );
      setValue(
        "coadvisor_emailId",
        initVal.coadvisor
          ? formOptions.facultyOptions.find(
              (option) => option.label === initVal.coadvisor
            )
          : { value: "null@iiitd.ac.in", label: "None" }
      );
    }
  }, [faculty]);

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
      if (initVal) {
        window.location.href = `${BASE}/db/${data.rollNumber}/`;
      }
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
            <label htmlFor="rollNumber">Roll Number*</label>
            <Input
              type="text"
              id="rollNumber"
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
          <div className="col-span-2">
            <label htmlFor="emailId">Email ID*</label>
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
            <label htmlFor="gender">Gender*</label>
            <Controller
              name="gender"
              id="gender"
              control={control}
              rules={{ required: "Gender is required" }}
              render={({ field }) => (
                <Select
                  placeholder="Select Gender"
                  options={formOptions.genderOptions}
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
            <label htmlFor="department">Department*</label>
            <Controller
              name="department"
              id="department"
              control={control}
              rules={{ required: "Department is required" }}
              render={({ field }) => (
                <Select
                  placeholder="Select Department"
                  options={formOptions.departmentOptions}
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
            <label htmlFor="region">Region</label>
            <Controller
              name="region"
              id="region"
              control={control}
              render={({ field }) => (
                <Select
                  placeholder="Select Region"
                  isClearable
                  backspaceRemovesValue
                  options={formOptions.regionOptions}
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
            <label htmlFor="joiningDate">Joining Date*</label>
            <Input
              type="date"
              id="joiningDate"
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
            <label htmlFor="batchMonth">Batch Month*</label>
            <Controller
              name="batchMonth"
              id="batchMonth"
              control={control}
              rules={{ required: "Batch Month is required" }}
              render={({ field }) => (
                <Select
                  placeholder="Select Batch Month"
                  options={formOptions.monthOptions}
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
            <label htmlFor="batchYear">Batch Year*</label>
            <Input
              type="number"
              id="batchYear"
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
            <label htmlFor="educationalQualification">
              Educational Qualification
            </label>
            <Input
              type="text"
              id="educationalQualification"
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
            <label htmlFor="admissionThrough">Admission Through*</label>
            <Controller
              name="admissionThrough"
              id="admissionThrough"
              control={control}
              rules={{ required: "Admission Through is required" }}
              render={({ field }) => (
                <Select
                  placeholder="Select Admission Through"
                  options={formOptions.admissionOptions}
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
            <label htmlFor="fundingType">Funding Type*</label>
            <Controller
              name="fundingType"
              id="fundingType"
              control={control}
              rules={{ required: "Funding Type is required" }}
              render={({ field }) => (
                <Select
                  placeholder="Select Funding Type"
                  options={formOptions.fundingOptions}
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
            <label htmlFor="sourceOfFunding">Source Of Funding</label>
            <Input
              type="text"
              id="sourceOfFunding"
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
            <label htmlFor="stipendMonths">Stipend Months Left</label>
            <Input
              type="number"
              id="stipendMonths"
              error={Boolean(errors.stipendMonths)}
              defaultValue={60}
              {...register("stipendMonths", {
                min: {
                  value: 0,
                  message: "Input must be greater than or equal to 0",
                },
                valueAsNumber: true,
              })}
            />
            {errors.stipendMonths && (
              <span className="text-red-500">
                {errors.stipendMonths.message}
              </span>
            )}
          </div>
          <div>
            <label htmlFor="contingencyPoints">Contingency Points*</label>
            <Input
              type="number"
              id="contingencyPoints"
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
            <label htmlFor="contingencyYears">Contingency Years Left</label>
            <Input
              type="number"
              id="contingencyYears"
              error={Boolean(errors.contingencyYears)}
              defaultValue={4}
              {...register("contingencyYears", {
                min: {
                  value: 0,
                  message: "Input must be greater than or equal to 0",
                },
                valueAsNumber: true,
              })}
            />
            {errors.contingencyYears && (
              <span className="text-red-500">
                {errors.contingencyYears.message}
              </span>
            )}
          </div>
          <div>
            <label htmlFor="studentStatus">Student Status*</label>
            <Controller
              name="studentStatus"
              id="studentStatus"
              control={control}
              rules={{ required: "Student Status is required" }}
              render={({ field }) => (
                <Select
                  placeholder="Select Status"
                  options={formOptions.statusOptions}
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
            <label htmlFor="advisor1_emailId">Advisor 1</label>
            <Controller
              name="advisor1_emailId"
              id="advisor1_emailId"
              control={control}
              render={({ field }) => (
                <Select
                  placeholder="Select Advisor 1"
                  defaultValue={{ value: "null@iiitd.ac.in", label: "None" }}
                  isLoading={advisorLoading}
                  options={formOptions.facultyOptions}
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
            <label htmlFor="advisor2_emailId">Advisor 2</label>
            <Controller
              name="advisor2_emailId"
              id="advisor2_emailId"
              control={control}
              render={({ field }) => (
                <Select
                  placeholder="Select Advisor 2"
                  defaultValue={{ value: "null@iiitd.ac.in", label: "None" }}
                  isLoading={advisorLoading}
                  options={formOptions.facultyOptions}
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
            <label htmlFor="coadvisor_emailId">Coadvisor</label>
            <Controller
              name="coadvisor_emailId"
              id="coadvisor_emailId"
              control={control}
              render={({ field }) => (
                <Select
                  placeholder="Select Coadvisor"
                  defaultValue={{ value: "null@iiitd.ac.in", label: "None" }}
                  isLoading={advisorLoading}
                  options={formOptions.facultyOptions}
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
            <label htmlFor="thesisSubmissionDate">Thesis Submission Date</label>
            <Input
              type="date"
              id="thesisSubmissionDate"
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
            <label htmlFor="thesisDefenceDate">Thesis Defence Date</label>
            <Input
              type="date"
              id="thesisDefenceDate"
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
            <label htmlFor="yearOfLeaving">Year of Leaving</label>
            <Input
              type="number"
              id="yearOfLeaving"
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
          <div className="col-span-2">
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

import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Spinner,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import React, { useState } from "react";

function Invigilation_EligibleStudents({ onSubmit }) {
  const [eligibleStudentsFile, setEligibleStudentsFile] = useState();
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [errorResponse, setErrorResponse] = useState();
  const API = import.meta.env.VITE_BACKEND_URL;

  const getFileTemplate = async () => {
    try {
      const response = await axios.get(`${API}/api/studentList/`, {
        responseType: "blob",
      });
      console.log(response);

      const file = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const fileURL = URL.createObjectURL(file);

      const fileLink = document.createElement("a");
      fileLink.href = fileURL;
      fileLink.setAttribute("download", "EligibleStudent.xlsx");
      document.body.appendChild(fileLink);
      fileLink.click();
      fileLink.remove();
      URL.revokeObjectURL(fileURL);
    } catch (error) {
      console.error(error);
      alert("Failed to download template");
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setErrorResponse();
    setIsSubmitDisabled(true);
    setEligibleStudentsFile(file);

    if (!file) {
      alert("No file uploaded");
      return;
    }
    if (
      file.type !=
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      alert("Incorrect file format: Please select an .xlsx file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const response = await axios.post(`${API}/api/studentList/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        alert("File uploaded successfully");
        setIsSubmitDisabled(false);
      } else {
        setErrorResponse(response.data);
      }
    } catch (error) {
      setErrorResponse(error?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    onSubmit();
  };

  return (
    <div className="h-full w-full">
      <Card className="h-full w-full">
        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-none mt-0 sticky top-0 z-20 flex items-center justify-between py-1"
        >
          <div>
            <Typography variant="h4" color="blue-gray">
              Eligible Students
            </Typography>
          </div>
          <div className="flex gap-4">
            <Tooltip content="Dowload Eligible Students template file">
              <Button
                size="sm"
                variant="outlined"
                ripple={true}
                onClick={() => getFileTemplate()}
                className="flex items-center gap-2"
              >
                <ArrowDownTrayIcon strokeWidth={2} className="size-4" />
                Download Template
              </Button>
            </Tooltip>
            <Tooltip
              content={isSubmitDisabled ? "Upload File first" : "Next Step"}
            >
              <div>
                <Button
                  onClick={handleSubmit}
                  size="sm"
                  color={isSubmitDisabled ? "blue-gray" : "green"}
                  ripple={true}
                  className="flex items-center gap-2 h-9"
                  disabled={isSubmitDisabled}
                >
                  Submit
                  <ArrowRightIcon className="size-4" />
                </Button>
              </div>
            </Tooltip>
          </div>
        </CardHeader>
        <CardBody className="p-0 mt-5 h-full w-full">
          <div className="h-full w-full flex px-4">
            <div className="flex items-center justify-center h-full flex-1">
              <label className="w-[80vh] h-[40vh] flex flex-col items-center justify-center px-4 py-6 text-blue rounded-lg shadow-lg tracking-wide uppercase border-2 border-dashed border-black cursor-pointer hover:border-0 hover:bg-blue-gray-200/70">
                <svg
                  className="size-8"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                </svg>
                <span className="mt-2 text-base leading-normal">
                  {eligibleStudentsFile
                    ? eligibleStudentsFile.name
                    : "Select a file"}
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept=".xlsx"
                  onChange={handleFileChange}
                  onClick={(event) => (event.target.value = null)}
                />
              </label>
            </div>
            {errorResponse && (
              <div className="flex flex-col flex-1 max-h-[60vh]">
                <div>
                  <Typography variant="h4" color="red">
                    Error
                  </Typography>
                </div>
                <div>
                  <Typography variant="h5">
                    Message: {errorResponse.error}
                  </Typography>
                </div>
                {errorResponse.invalid_rows && (
                  <div className="mt-4 overflow-auto">
                    <table className="w-full">
                      <thead className="sticky top-0 z-20">
                        <tr>
                          {["Row", "Reason"].map((head) => (
                            <th
                              key={head}
                              className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                            >
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal leading-none opacity-70"
                              >
                                {head}
                              </Typography>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {errorResponse.invalid_rows.map(
                          ({ row, reasons }, index) => {
                            const classes = "p-4 border-b border-blue-gray-50";

                            return (
                              <tr key={row}>
                                <td className={classes}>
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                  >
                                    {row}
                                  </Typography>
                                </td>
                                <td className={classes}>
                                  {reasons.map((reason) => (
                                    <Chip
                                      value={reason}
                                      variant="ghost"
                                      size="sm"
                                      color="red"
                                      className="m-1 rounded-full text-red-500 w-min"
                                    />
                                  ))}
                                </td>
                              </tr>
                            );
                          }
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
            {isLoading && (
              <div className="m-4">
                <Spinner className="size-8" />
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default Invigilation_EligibleStudents;

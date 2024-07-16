import React, { useContext, useRef, useState } from "react";

import {
  Alert,
  Button,
  Card,
  CardBody,
  Chip,
  Dialog,
  DialogBody,
  DialogHeader,
  Spinner,
  Typography,
} from "@material-tailwind/react";

import StudentContext from "../context/StudentContext";
import StudentForm from "./StudentForm";

function AddStudentDialog({ isOpen, setOpen }) {
  const { getTemplate, uploadFile } = useContext(StudentContext);
  const [file, setFile] = useState();
  const [error, setError] = useState(null);
  const [invalidRows, setInvalidRows] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleOpen = () => {
    setOpen(!isOpen);
    setFile(null);
    setError(null);
    setInvalidRows(null);
    setLoading(false);
  };

  const handleFileUpload = async (event) => {
    const uploadedFile = event.target.files[0];

    if (uploadedFile.size > 100 * 1024 * 1024) {
      setError("File should be less than 100 MB");
      setLoading(false);
      return;
    }

    setFile(uploadedFile);
    setLoading(true);
    const response = await uploadFile(uploadedFile);
    setLoading(false);
    if (response == undefined) {
      handleOpen();
    } else {
      console.log(response.invalidData);
      setError(response.error);
      if (response.invalidData) {
        setInvalidRows(response.invalidData);
      }
    }
  };

  return (
    <Dialog open={isOpen} handler={handleOpen} className="max-h-[90vh]">
      <DialogHeader className="cursor-default max-h-[10vh]">
        Add Student
      </DialogHeader>
      <DialogBody className="overflow-auto mb-4 max-h-[75vh]">
        <Card shadow={false}>
          <CardBody className="flex flex-col items-center">
            <Button onClick={() => fileInputRef.current.click()}>
              <input
                type="file"
                accept=".xlsx"
                style={{ display: "none" }}
                onChange={handleFileUpload}
                ref={fileInputRef}
              />
              {file ? `${file.name}` : "Upload XLSX File"}
            </Button>

            <Typography variant="small" className="mt-2 cursor-default">
              <span
                onClick={() => getTemplate()}
                className="underline cursor-pointer hover:opacity-75"
              >
                Click here
              </span>{" "}
              to download the XLSX file template
            </Typography>
          </CardBody>
        </Card>

        {file ? null : (
          <div>
            <div className="flex items-center">
              <hr className="border-gray-500 flex-1" />
              <div className="mx-2 cursor-default">OR</div>
              <hr className="border-gray-500 flex-1" />
            </div>
            <StudentForm setOpen={setOpen} initVal={null} />
          </div>
        )}

        {error == null ? null : (
          <div>
            <Alert color="red" variant="ghost" className="text-red-500">
              {error}
            </Alert>

            {invalidRows == null ? null : (
              <Card className="h-[40vh] w-full overflow-scroll my-2">
                <table className="w-full min-w-max table-auto text-left">
                  <thead className="sticky top-0 z-20">
                    <tr>
                      {[
                        "Roll Number",
                        "Name",
                        "Email ID",
                        "Dept.",
                        "Errors",
                      ].map((head) => (
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
                    {invalidRows.map(({ error, student }, index) => (
                      <tr key={student} className="even:bg-blue-gray-50/50">
                        {[
                          student.rollNumber,
                          student.name,
                          student.emailId,
                          student.department,
                        ].map((data) => (
                          <td className="p-4">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {data}
                            </Typography>
                          </td>
                        ))}

                        <td className="p-4">
                          {Object.values(error).map((error) => (
                            <Chip
                              value={error}
                              variant="ghost"
                              size="sm"
                              color="red"
                              className="m-1 rounded-full text-red-500 w-min"
                            />
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            )}
          </div>
        )}

        {loading ? (
          <div className="flex justify-end">
            <Spinner className="size-10" />
          </div>
        ) : null}
      </DialogBody>
    </Dialog>
  );
}

export default AddStudentDialog;

import React, { useState } from "react";
import { Button,Tooltip } from "@material-tailwind/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

function StudentProfileExam() {
  const [pdfFile, setPdfFile] = useState(null);

  const receivePdfFile = (file) => {
    setPdfFile(file);
    console.log(file)
  };

  const openPdfFile = () => {
    window.open(pdfFile, "_blank");
  };

  const deletePdfFile = () => {
    setPdfFile(null);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-4">
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => receivePdfFile(e.target.files[0])}
          className="hidden"
          id="pdfFileInput"
        />
        <label
          htmlFor="pdfFileInput"
          className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600"
        >
          {pdfFile ? "Replace PDF" : "Upload PDF"}
        </label>
      </div>
      {pdfFile && (
        <div className="flex space-x-4">
          <Button
            color="blue"
            buttonType="filled"
            onClick={openPdfFile}
          >
            Open PDF {pdfFile.name}
          </Button>
        
          <Button
            color="red"
            buttonType="filled"
            onClick={deletePdfFile}
          >
            Delete PDF
          </Button>
        </div>
      )}
    </div>
  );
}

export default StudentProfileExam;

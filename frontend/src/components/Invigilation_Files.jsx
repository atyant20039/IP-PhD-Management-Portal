import { useState, useEffect, useContext } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
  
  } from "@material-tailwind/react";
  
  import {
    AcademicCapIcon,
  
  } from "@heroicons/react/24/solid";
function Invigilation_Files({onSubmission1,onSubmission2}) {

    const [file1, setFile1] = useState(null);
    const [file2, setFile2] = useState(null);
    const [fileName1, setFileName1] = useState('');
    const [fileName2, setFileName2] = useState('');
  
    const handleFile1Change = (event) => {
      const selectedFile = event.target.files[0];
      setFile1(selectedFile);
      setFileName1(selectedFile.name);
      onSubmission1()
    };
  
    const handleFile2Change = (event) => {
      const selectedFile = event.target.files[0];
      setFile2(selectedFile);
      setFileName2(selectedFile.name);
      onSubmission2()
    };
  
    const saveFiles = () => {
      // You can handle saving the files here
      console.log("File 1:", file1);
      console.log("File 2:", file2);
      // Implement your logic to save the files
    };
  return (
    <div>
          <Card shadow={false}>
  <CardHeader floated={false} shadow={false}>
    <Typography variant="h4" color="blue-gray">
      Invigilation Files
    </Typography>
  </CardHeader>
  <CardBody className="flex flex-row flex-1 items-center m-2">
     <div className="m-2">
    <input
        id="fileInput1"
        className="opacity-0 w-0 h-0 overflow-hidden"
        type="file"
        accept=".xlsx"
        onChange={handleFile1Change}
      />
      <label
        htmlFor="fileInput1"
        className="cursor-pointer py-2 px-8 bg-blue-500 font-semibold text-white text-sm rounded-md hover:bg-blue-600"
      >
        Add File 1
      </label>
      {fileName1 ? (
      <Typography className="m-1" variant="small">{fileName1}</Typography>
    ) : (
      <Typography className="m-1" variant="small">No file selected</Typography>
    )}  </div>
    <div className="m-2">
      <input
        id="fileInput2"
        className="opacity-0 w-0 h-0 overflow-hidden"
        type="file"
        accept=".xlsx"
        onChange={handleFile2Change}
      />
      <label
        htmlFor="fileInput2"
        className="cursor-pointer py-2 px-8 bg-blue-500 font-semibold text-white text-sm rounded-md hover:bg-blue-600"
      >
        Add File 2
      </label>
      {fileName2 ? (
      <Typography className="m-1"  variant="small">{fileName2}</Typography>
    ) : (
      <Typography className="m-1" variant="small">No file selected</Typography>
    )} </div>
      <button
        onClick={saveFiles}
        className="py-2 px-8 bg-green-500 font-semibold text-white text-sm rounded-md hover:bg-green-600"
      >
        Save
      </button>

  </CardBody>
</Card>
        
    </div>
  )
}

export default Invigilation_Files
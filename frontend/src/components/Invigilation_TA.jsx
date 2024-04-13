import React, { useState } from "react";
import {
  Button,
  Input,
  Card,
  Typography,
  Tooltip,
  IconButton
} from "@material-tailwind/react";

function Invigilation_TA({onSubmission}) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    // Filter out the id field from each object in the tableData array

    onSubmission()

    try {
      // Simulate response
      // const response = await fetch(`${API}/api/classroom/`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(requestData),
      // });

      // if (!response.ok) {
      //   throw new Error("Network response was not ok");
      // }

      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };
  return (
    <div className="mt-4">
    <Button color="blue" onClick={handleSubmit}>
      Submit
    </Button>
  </div>
  )
}

export default Invigilation_TA
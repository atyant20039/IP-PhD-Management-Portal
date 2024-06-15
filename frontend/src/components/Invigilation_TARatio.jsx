import { ArrowRightIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import React, { useState } from "react";

function Invigilation_TARatio({ onSubmit, taRatio, setTaRatio }) {
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const handleSubmit = async () => {
    onSubmit();
  };

  const handleInputChange = (newValue) => {
    setTaRatio(newValue);
    if (newValue && newValue.length > 0) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
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
              TA Student Ratio
            </Typography>
          </div>
          <div className="flex gap-4">
            <Tooltip
              content={
                isSubmitDisabled ? "Enter Input value first" : "Next Step"
              }
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
          <div className="flex flex-col items-center gap-4">
            <Typography variant="h4">Enter the TA Student Ratio</Typography>

            <div>
              <Input
                label="TA Student Ratio"
                type="number"
                value={taRatio}
                onChange={(e) => handleInputChange(e.target.value)}
              />
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default Invigilation_TARatio;

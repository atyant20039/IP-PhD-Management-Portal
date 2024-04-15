import React from 'react';
import { Card, CardBody, Typography, CardHeader } from "@material-tailwind/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import './styles.css';

function StudentProfileData({ data }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Academic Information */}
      <Card className="flex-grow academic-card">
        <CardBody>
          <Typography color="blue-gray" className="font-semibold">Academic Information</Typography>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <Typography variant="subtitle">Batch</Typography>
              <Typography>{data.batch || "null"}</Typography>
            </div>
            <div>
              <Typography variant="subtitle">Educational Qualification</Typography>
              <Typography>{data.educationalQualification || "null"}</Typography>
            </div>
            <div>
              <Typography variant="subtitle">Joining Date</Typography>
              <Typography>{data.joiningDate || "null"}</Typography>
            </div>
            <div>
              <Typography variant="subtitle">Admission Through</Typography>
              <Typography>{data.admissionThrough || "null"}</Typography>
            </div>
            <div>
              <Typography variant="subtitle">Year of Leaving</Typography>
              <Typography>{data.yearOfLeaving || "null"}</Typography>
            </div>
            <div className="col-span-2 flex justify-end items-center">
             
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Financial Information */}
      <Card className="flex-grow financial-card" >
        <CardBody>
          <Typography color="blue-gray" className="font-semibold">Financial Information</Typography>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <Typography variant="subtitle">Funding Type</Typography>
              <Typography>{data.fundingType || "null"}</Typography>
            </div>
            <div>
              <Typography variant="subtitle">Contingency Points</Typography>
              <Typography>{data.contingencyPoints || "null"}</Typography>
            </div>
            <div>
              <Typography variant="subtitle">Source of Funding</Typography>
              <Typography>{data.sourceOfFunding || "null"}</Typography>
            </div>
            <div className="col-span-2 flex justify-end items-center">
            
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Thesis Information */}
      <Card className="flex-grow thesis-card">
        <CardBody>
          <Typography color="blue-gray" className="font-semibold">Thesis Information</Typography>
          <div className="mt-4">
            <div>
              <Typography variant="subtitle">Thesis Submission Date</Typography>
              <Typography>{data.thesisSubmissionDate || "null"}</Typography>
            </div>
            <div>
              <Typography variant="subtitle">Thesis Defence Date</Typography>
              <Typography>{data.thesisDefenceDate || "null"}</Typography>
            </div>
            <div className="flex justify-end items-center">
             
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Comment */}
      <Card className="col-span-1 sm:col-span-2 lg:col-span-3 comment">
        <CardBody>
          <Typography color="blue-gray" className="font-semibold">Comment</Typography>
          <div className="mt-4">
            <Typography>{data.comment || "null"}</Typography>
            <div className="flex justify-end items-center">

            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default StudentProfileData;

import {
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";

const advisor_details = {
  "Advisor 1": "advisor1",
  "Advisor 2": "advisor2",
  Coadvisor: "coadvisor",
};

const financial_details = {
  "Funding Type": "fundingType",
  "Source of Funding": "sourceOfFunding",
  "Contingency Points": "contingencyPoints",
  "Stipend Months": "stipendMonths",
  "Contingency Years": "contingencyYears",
};

const acedemic_details = {
  "Admission Through": "admissionThrough",
  "Educational Qualification": "educationalQualification",
  "Thesis Submission Date": "thesisSubmissionDate",
  "Thesis Defence Date": "thesisDefenceDate",
};

const basic_details = {
  Gender: "gender",
  "Joining Date": "joiningDate",
  Batch: "batch",
  Region: "region",
  "Student Status": "studentStatus",
  "Year of Leaving": "yearOfLeaving",
};

function StudentProfileData({ data }) {
  return (
    <div className="flex flex-row gap-3 h-full">
      <Card className="bg-gray-200/75 w-3/4">
        <div className="mx-4 my-2">
          <Typography variant="h4" color="blue-gray">
            Details
          </Typography>
        </div>
        <CardBody className="grid grid-cols-4 overflow-auto pt-0">
          {Object.keys(basic_details).map((key) => (
            <>
              <Typography variant="h6" className="col-span-1">
                {key}
              </Typography>
              <div className="col-span-3">
                {data[basic_details[key]] ? data[basic_details[key]] : "-"}
              </div>
            </>
          ))}
          <div className="col-span-4">
            <br />
          </div>
          <div className="col-span-4">
            <Typography variant="h5" color="blue-gray">
              Advisor Details
            </Typography>
          </div>
          {Object.keys(advisor_details).map((key) => (
            <>
              <Typography variant="h6" className="col-span-1">
                {key}
              </Typography>
              <div className="col-span-3">
                {data[advisor_details[key]] ? data[advisor_details[key]] : "-"}
              </div>
            </>
          ))}
          <div className="col-span-4">
            <br />
          </div>
          <div className="col-span-4">
            <Typography variant="h5" color="blue-gray">
              Financial Details
            </Typography>
          </div>
          {Object.keys(financial_details).map((key) => (
            <>
              <Typography variant="h6" className="col-span-1">
                {key}
              </Typography>
              <div className="col-span-3">
                {data[financial_details[key]]
                  ? data[financial_details[key]]
                  : "-"}
              </div>
            </>
          ))}
          <div className="col-span-4">
            <br />
          </div>
          <div className="col-span-4">
            <Typography variant="h5" color="blue-gray">
              Academic Details
            </Typography>
          </div>
          {Object.keys(acedemic_details).map((key) => (
            <>
              <Typography variant="h6" className="col-span-1">
                {key}
              </Typography>
              <div className="col-span-3">
                {data[acedemic_details[key]]
                  ? data[acedemic_details[key]]
                  : "-"}
              </div>
            </>
          ))}
        </CardBody>
      </Card>
      <Card className="bg-gray-200 w-1/4">
        <CardHeader shadow={false} floated={false} className="bg-gray-200 mt-2">
          <Typography variant="h4" color="blue-gray">
            Comment
          </Typography>
        </CardHeader>
        <CardBody className="overflow-auto">
          {data.comment ? data.comment : "No Comment"}
        </CardBody>
      </Card>
    </div>
  );
}

export default StudentProfileData;

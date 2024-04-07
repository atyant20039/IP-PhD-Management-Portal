import {
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";

// Below open-source illustrations downloaded for free from: https://undraw.co/
import DatabaseImg from "../assets/database.svg";
import StipendImg from "../assets/stipend.svg";
import ExamImg from "../assets/exam_invigilation.svg";
import FacultyImg from "../assets/faculty.svg";

import { Link } from "react-router-dom";

function Dashboard() {
  const list = [
    {
      text: "Database",
      url: "/db",
      img: DatabaseImg,
    },
    {
      text: "Stipend",
      url: "/stipend",
      img: StipendImg,
    },
    {
      text: "Invigilation",
      url: "/exam",
      img: ExamImg,
    },
    {
      text: "Faculty",
      url: "/faculty",
      img: FacultyImg,
    },
  ];

  return (
    <div className="flex flex-col h-screen">
      <Card className="h-full w-full">
        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-none mt-0 pt-4"
        >
          <div className="flex items-center ml-6 justify-between">
            <div>
              <Typography variant="h3" color="blue-gray">
                Ph.D. Management Portal
              </Typography>
            </div>
          </div>

        </CardHeader>
        <CardBody className="m-5 flex-1 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
          {list.map((item, index) => (
            <Link key={index} to={item.url}>
              <Card className="relative w-auto h-max border shadow-none border-blue-gray-100 hover:scale-105 transition-all hover:shadow-md ">
                <CardHeader
                  floated={false}
                  className="h-min flex place-content-center"
                >
                  <img
                    src={item.img}
                    className="size-20 md:size-40 xl:size-60 2xl:size-80"
                    alt={item.text}
                  />
                </CardHeader>
                <CardBody className="static text-center">
                  <Typography variant="h4" color="blue-gray" className="mb-2">
                    {item.text}
                  </Typography>
                </CardBody>
              </Card>
            </Link>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}

export default Dashboard;

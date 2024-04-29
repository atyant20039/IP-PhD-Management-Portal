import { useState } from "react";
import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import { PencilIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
  Avatar,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";

const TABLE_HEAD = ["Name", "Job", "Employed", "Eligible"];

const rows_new = [
  {
    name: "Sarah Johnson",
    job: "Manager",
    date: "12/05/19",
    eligible: "Yes",
  },
  {
    name: "David Smith",
    job: "Developer",
    date: "18/08/20",
    eligible: "No",
  },
  {
    name: "Emily Brown",
    job: "Executive",
    date: "03/11/18",
    eligible: "Yes",
  },
  {
    name: "Jessica Miller",
    job: "Designer",
    date: "27/09/17",
    eligible: "Yes",
  },
  {
    name: "Matthew Wilson",
    job: "Manager",
    date: "09/07/21",
    eligible: "No",
  },
];

const TABLE_ROWS = [
  {
    name: "John Michael",
    job: "Manager",
    date: "23/04/18",
    eligible: "Yes",
  },
  {
    name: "Alexa Liras",
    job: "Developer",
    date: "23/04/18",
    eligible: "No",
  },
  {
    name: "Laurent Perrier",
    job: "Executive",
    date: "19/09/17",
    eligible: "Yes",
  },
  {
    name: "Michael Levi",
    job: "Developer",
    date: "24/12/08",
    eligible: "Yes",
  },
  {
    name: "Richard Gran",
    job: "Manager",
    date: "04/10/21",
    eligible: "No",
  },
];

function Stipend() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewTable, setShowNewTable] = useState(false);
  const [tableData, setTableData] = useState(TABLE_ROWS);

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    if (!term) {
      setTableData(showNewTable ? rows_new : TABLE_ROWS);
      return;
    }
    const filteredData = (showNewTable ? rows_new : TABLE_ROWS).filter((row) =>
      Object.values(row).some(
        (value) =>
          value && value.toLowerCase().includes(term.toLowerCase())
      )
    );
    setTableData(filteredData);
  };

  const handleToggleTable = () => {
    setShowNewTable(!showNewTable);
    setTableData(showNewTable ? TABLE_ROWS : rows_new);
  };

  return (
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="h-24 m-0">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row mx-2 ">
        <div>
            <Button onClick={handleToggleTable}>
              {showNewTable ? "Show Old Table" : "Show New Table"}
            </Button>
          </div>
          <div className="w-full">
            <Input
              label="Search"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              onChange={handleSearch}
            />
          </div>
         
        </div>
      </CardHeader>
      <CardBody className="overflow-scroll px-0 py-0">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
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
            {tableData.map(({ name, job, date, eligible }, index) => {
              const isLast = index === tableData.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";

              return (
                <tr key={name + job + date + eligible}>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {name}
                    </Typography>
                  </td>
                  <td className={`${classes} bg-blue-gray-50/50`}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {job}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {date}
                    </Typography>
                  </td>
                  <td className={`${classes} bg-blue-gray-50/50`}>
                    <Typography
                      as="a"
                      href="#"
                      variant="small"
                      color="blue-gray"
                      className="font-medium"
                    >
                      {eligible}
                    </Typography>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="p-2">
        <Button variant="outlined" size="sm">
          Submit List
        </Button>
      </CardFooter>
    </Card>
  );
}

export default Stipend;

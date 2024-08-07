import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronUpDownIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { ArrowDownTrayIcon, UserPlusIcon } from "@heroicons/react/24/solid";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  IconButton,
  Input,
  Spinner,
  Typography,
} from "@material-tailwind/react";

import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AddStudentDialog from "../components/AddStudentDialog";
import FilterDialog from "../components/FilterDialog";
import StudentContext from "../context/StudentContext";

const TABLE_HEAD = [
  {
    head: "Roll No.",
    value: "rollNumber",
  },
  {
    head: "Name",
    value: "name",
  },
  {
    head: "Email ID",
    value: "emailId",
  },
  {
    head: "Gender",
    value: "gender",
  },
  {
    head: "Dept.",
    value: "department",
  },
  {
    head: "C.Points",
    value: "contingencyPoints",
  },
  {
    head: "Status",
    value: "studentStatus",
  },
  {
    head: "Advisor 1",
    value: "advisor_set__advisor1",
  },
  {
    head: "Advisor 2",
    value: "advisor_set__advisor2",
  },
  {
    head: "Co-Advisor",
    value: "advisor_set__coadvisor",
  },
  {
    head: "Joining Date",
    value: "joiningDate",
  },
  {
    head: "Batch",
    value: "batch",
  },
  {
    head: "Funding Type",
    value: "fundingType",
  },
  {
    head: "Source of Funding",
    value: "sourceOfFunding",
  },
  {
    head: "Stipend Months Left",
    value: "stipendMonths",
  },
  {
    head: "Contingency Years Left",
    value: "contingencyYears",
  },
  {
    head: "Admission",
    value: "admissionThrough",
  },
  {
    head: "Qualification",
    value: "educationalQualification",
  },
  {
    head: "Region",
    value: "region",
  },
  {
    head: "Thesis Submission Date",
    value: "thesisSubmissionDate",
  },
  {
    head: "Thesis Defence Date",
    value: "thesisDefenceDate",
  },
  {
    head: "Year of Leaving",
    value: "yearOfLeaving",
  },
  {
    head: "Comment",
    value: "comment",
  },
];

export default function Database() {
  const { students, fetchData, Error, downloadStudents } =
    useContext(StudentContext);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("rollNumber");
  const [isExpanded, setExpanded] = useState(false);
  const [isFilterDialogOpen, setFilterDialog] = useState(false);
  const [isAddDialogOpen, setAddDialog] = useState(false);
  const [filters, setFilters] = useState({});
  const navigate = useNavigate();

  const page = students?.page || 1;
  const total_pages = students?.total_pages || 1;

  const handleFilterSelect = (selectedOptions) => {
    setFilters(selectedOptions);
  };

  const handleSort = (selectedSort) => {
    setSort((currentSort) => {
      if (currentSort === selectedSort) {
        return `-${selectedSort}`;
      } else if (currentSort === `-${selectedSort}`) {
        return selectedSort;
      } else {
        return selectedSort;
      }
    });
  };

  useEffect(() => {
    fetchData(1, "", "rollNumber", setLoading, filters);
  }, []);

  useEffect(() => {
    fetchData(1, search, sort, setLoading, filters);
  }, [sort, filters]);

  useEffect(() => {
    const delay = 500;
    const timer = setTimeout(() => {
      fetchData(1, search, sort, setLoading, filters);
    }, delay);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="flex flex-col h-screen">
      <Card className="relative h-full w-full flex flex-1 flex-col">
        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-none mt-0 pt-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <Typography
                variant="h4"
                color="blue-gray"
                className="cursor-default"
              >
                Students list
              </Typography>
            </div>
            <div className="flex-1 mx-8">
              <Input
                label="Search"
                icon={<MagnifyingGlassIcon className="size-5" />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <Button
                variant="outlined"
                size="sm"
                className="flex items-center gap-3 h-10"
                onClick={() => setFilterDialog(!isFilterDialogOpen)}
              >
                <FunnelIcon className="size-4" />
                filter
              </Button>
              <FilterDialog
                isOpen={isFilterDialogOpen}
                setOpen={setFilterDialog}
                member="Students"
                onApplyFilters={handleFilterSelect}
              />
              <Button
                className="flex items-center gap-3 h-10"
                size="sm"
                variant="outlined"
                onClick={() => downloadStudents(search, sort, filters)}
              >
                <ArrowDownTrayIcon strokeWidth={2} className="size-4" />
                Download
              </Button>
              <Button
                className="flex items-center gap-3 h-10"
                size="sm"
                onClick={() => setAddDialog(!isAddDialogOpen)}
              >
                <UserPlusIcon strokeWidth={2} className="size-4" /> Add Student
              </Button>
              <AddStudentDialog
                isOpen={isAddDialogOpen}
                setOpen={setAddDialog}
              />
            </div>
          </div>
        </CardHeader>
        <CardBody className="p-0 px-2 mt-5 flex flex-1 overflow-auto">
          {/* TODO: students && students.results -> check this conditions works on empty (not null) students.results list or not */}
          {students && students.results && students.results.length != 0 ? (
            <div className="flex flex-row flex-1 w-full h-full">
              <div className="overflow-auto flex-1">
                <table className="w-full min-w-max table-auto text-left h-min">
                  <thead className="sticky top-0 bg-white z-20">
                    <tr>
                      {TABLE_HEAD.map(
                        ({ head, value }, index) =>
                          (index < 7 && (
                            <th
                              key={head}
                              className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                              onClick={() => handleSort(value)}
                            >
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                              >
                                {head}{" "}
                                <ChevronUpDownIcon
                                  strokeWidth={2}
                                  className="h-4 w-4"
                                />
                              </Typography>
                            </th>
                          )) ||
                          (index >= 7 && isExpanded && (
                            <th
                              key={head}
                              className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                              onClick={() => handleSort(value)}
                            >
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                              >
                                {head}{" "}
                                <ChevronUpDownIcon
                                  strokeWidth={2}
                                  className="h-4 w-4"
                                />
                              </Typography>
                            </th>
                          ))
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {students.results.map((student) => {
                      const classes = "px-4 py-3 border-b border-blue-gray-50";

                      const handleDoubleClick = (rno) => {
                        navigate(`/db/${rno}`);
                      };

                      return (
                        <tr
                          key={student.name}
                          className="hover:bg-blue-gray-50"
                          onDoubleClick={() =>
                            handleDoubleClick(student.rollNumber)
                          }
                          style={{ userSelect: "none" }}
                        >
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal text-xs"
                            >
                              {student.rollNumber}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal text-xs"
                            >
                              {student.name}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal text-xs"
                            >
                              {student.emailId}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <div className="w-max">
                              <Chip
                                variant="ghost"
                                size="sm"
                                value={student.gender}
                                className="px-1.5"
                                color={
                                  student.gender == "Male"
                                    ? "blue"
                                    : student.gender == "Female"
                                    ? "pink"
                                    : "gray"
                                }
                              />
                            </div>
                          </td>
                          <td className={classes}>
                            <div className="w-max">
                              <Chip
                                variant="ghost"
                                size="sm"
                                className="px-1.5"
                                value={student.department}
                              />
                            </div>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal text-xs"
                            >
                              {student.contingencyPoints}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <div className="w-max">
                              <Chip
                                variant="ghost"
                                size="sm"
                                className="px-1.5"
                                value={student.studentStatus}
                                color={
                                  student.studentStatus === "Active"
                                    ? "green"
                                    : student.studentStatus === "Terminated"
                                    ? "red"
                                    : student.studentStatus === "Semester Leave"
                                    ? "amber"
                                    : student.studentStatus === "Shifted"
                                    ? "blue"
                                    : student.studentStatus === "Graduated"
                                    ? "gray"
                                    : "blue-gray"
                                }
                              />
                            </div>
                          </td>
                          {isExpanded && (
                            <>
                              <td className={classes}>
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal text-xs"
                                >
                                  {student.advisor1 ? student.advisor1 : "-"}
                                </Typography>
                              </td>
                              <td className={classes}>
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal text-xs"
                                >
                                  {student.advisor2 ? student.advisor2 : "-"}
                                </Typography>
                              </td>
                              <td className={classes}>
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal text-xs"
                                >
                                  {student.coadvisor ? student.coadvisor : "-"}
                                </Typography>
                              </td>
                              <td className={classes}>
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal text-xs"
                                >
                                  {student.joiningDate}
                                </Typography>
                              </td>
                              <td className={classes}>
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal text-xs"
                                >
                                  {student.batch}
                                </Typography>
                              </td>
                              <td className={classes}>
                                <div className="w-max">
                                  <Chip
                                    variant="ghost"
                                    size="sm"
                                    className="px-1.5"
                                    value={student.fundingType}
                                  />
                                </div>
                              </td>
                              <td className={classes}>
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal text-xs w-48"
                                >
                                  {student.sourceOfFunding
                                    ? student.sourceOfFunding
                                    : "-"}
                                </Typography>
                              </td>
                              <td className={classes}>
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal text-xs w-48"
                                >
                                  {student.stipendMonths
                                    ? student.stipendMonths
                                    : "-"}
                                </Typography>
                              </td>
                              <td className={classes}>
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal text-xs w-48"
                                >
                                  {student.contingencyYears
                                    ? student.contingencyYears
                                    : "-"}
                                </Typography>
                              </td>
                              <td className={classes}>
                                <div className="w-max">
                                  <Chip
                                    variant="ghost"
                                    size="sm"
                                    className="px-1.5"
                                    value={student.admissionThrough}
                                  />
                                </div>
                              </td>
                              <td className={classes}>
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal text-xs w-48"
                                >
                                  {student.educationalQualification
                                    ? student.educationalQualification
                                    : "-"}
                                </Typography>
                              </td>
                              <td className={classes}>
                                <div className="w-max">
                                  {student.region ? (
                                    <Chip
                                      variant="ghost"
                                      size="sm"
                                      className="px-1.5"
                                      value={student.region}
                                    />
                                  ) : (
                                    <Typography
                                      variant="small"
                                      color="blue-gray"
                                      className="font-normal text-xs"
                                    >
                                      -
                                    </Typography>
                                  )}
                                </div>
                              </td>
                              <td className={classes}>
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal text-xs"
                                >
                                  {student.thesisSubmissionDate
                                    ? student.thesisSubmissionDate
                                    : "-"}
                                </Typography>
                              </td>
                              <td className={classes}>
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal text-xs"
                                >
                                  {student.thesisDefenceDate
                                    ? student.thesisDefenceDate
                                    : "-"}
                                </Typography>
                              </td>
                              <td className={classes}>
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal text-xs"
                                >
                                  {student.yearOfLeaving
                                    ? student.yearOfLeaving
                                    : "-"}
                                </Typography>
                              </td>
                              <td className={classes}>
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal text-xs w-48"
                                >
                                  {student.comment ? student.comment : "-"}
                                </Typography>
                              </td>
                            </>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="top-0 right-0 bottom-0 flex items-center mr-1">
                <Button
                  className="h-full p-2 focus:ring-0 hover:bg-blue-gray-50 hover:opacity-100"
                  variant="outlined"
                  size="sm"
                  color="blue-gray"
                  onClick={() => setExpanded(!isExpanded)}
                >
                  {isExpanded ? (
                    <ChevronDoubleLeftIcon className="size-4" />
                  ) : (
                    <ChevronDoubleRightIcon className="size-4" />
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col place-content-center place-items-center">
              {loading ? (
                <Spinner className="size-12" />
              ) : (
                <div>
                  <XCircleIcon className="h-48 w-48" />
                  <Typography variant="h3" className="cursor-default">
                    No Data Found
                  </Typography>
                </div>
              )}
            </div>
          )}
        </CardBody>
        <CardFooter className="flex place-content-center border-t border-blue-gray-50 p-4">
          <div className="flex items-center gap-8">
            <IconButton
              size="sm"
              variant="outlined"
              onClick={() => {
                if (students.previous) {
                  fetchData(page - 1, search, sort, setLoading, filters);
                }
              }}
              disabled={page === 1}
            >
              <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />
            </IconButton>
            <Typography color="gray" className="font-normal cursor-default">
              Page <strong className="text-gray-900">{page}</strong> of{" "}
              <strong className="text-gray-900">{total_pages}</strong>
            </Typography>
            <IconButton
              size="sm"
              variant="outlined"
              onClick={() => {
                if (students.next) {
                  fetchData(page + 1, search, sort, setLoading, filters);
                }
              }}
              disabled={page === total_pages}
            >
              <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
            </IconButton>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

import React from "react";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XCircleIcon,
  ChevronUpDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { UserPlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  CardFooter,
  Chip,
  Spinner,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";

import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import FacultyContext from "../context/FacultyContext";
import FilterDialog from "../components/FilterDialog";
import AddMemberDialog from "../components/AddMemberDialog";

const TABLE_HEAD = [
  {
    head: "Name",
    value: "name",
  },
  {
    head: "Email ID",
    value: "emailId",
  },
  {
    head: "Department",
    value: "department",
  },
  {
    head: "",
    value: "",
  },
];

function Faculty() {
  const { faculty, fetchData } = useContext(FacultyContext);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name");
  const [isFilterDialogOpen, setFilterDialog] = useState(false);
  const [isAddDialogOpen, setAddDialog] = useState(false);
  const navigate = useNavigate();

  const page = faculty ? (faculty.page ? faculty.page : 1) : 1;
  const total_pages = faculty
    ? faculty.total_pages
      ? faculty.total_pages
      : 1
    : 1;

  useEffect(() => {
    if (faculty === null) {
      fetchData(page, search, sort, setLoading);
    }
  }, []);

  useEffect(() => {
    fetchData(1, search, sort, setLoading);
  }, [sort]);

  useEffect(() => {
    const delay = 500;
    const timer = setTimeout(() => {
      fetchData(1, search, sort, setLoading);
    }, delay);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="flex flex-col h-screen">
      <Card className="h-full w-full flex flex-1 flex-col">
        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-none mt-0 pt-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="h4" color="blue-gray">
                Faculty list
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
                member="Professors"
              />
              <Button
                className="flex items-center gap-3 h-10"
                size="sm"
                onClick={() => setAddDialog(!isAddDialogOpen)}
              >
                <UserPlusIcon strokeWidth={2} className="size-4" /> Add
                Professor
              </Button>
              <AddMemberDialog
                isOpen={isAddDialogOpen}
                setOpen={setAddDialog}
                member="Professor"
              />
            </div>
          </div>
        </CardHeader>
        <CardBody className="p-0 mt-5 flex flex-1 overflow-y-auto">
          {/* TODO: faculty && faculty.results -> check this conditions works on empty (not null) faculty.results list or not */}
          {faculty && faculty.results && faculty.results.length != 0 ? (
            <table className="w-full min-w-max table-auto text-left">
              <thead className="sticky top-0 bg-white z-20">
                <tr>
                  {TABLE_HEAD.map(({ head, value }, index) => (
                    <th
                      key={head}
                      className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                      onClick={() =>
                        index != TABLE_HEAD.length - 1 && setSort(value)
                      }
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                      >
                        {head}
                        {index != TABLE_HEAD.length - 1 && (
                          <ChevronUpDownIcon
                            strokeWidth={2}
                            className="h-4 w-4"
                          />
                        )}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {faculty.results.map(({ name, emailId, department }, index) => {
                  const isLast = index === faculty.results.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={name} className="hover:bg-blue-gray-50">
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal text-xs"
                        >
                          {name}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal text-xs"
                        >
                          {emailId}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <div className="w-max">
                          <Chip
                            variant="ghost"
                            size="sm"
                            className="px-1.5"
                            value={department}
                            // color={
                            //   department === "CSE"
                            //     ? "green"
                            //     : department === "CB"
                            //     ? "red"
                            //     : department === "ECE"
                            //     ? "amber"
                            //     : department === "HCD"
                            //     ? "blue"
                            //     : department === "MATHS"
                            //     ? "purple"
                            //     : department === "SSH"
                            //     ? "blue-gray"
                            //     : "gray"
                            // }
                          />
                        </div>
                      </td>
                      <td className={classes}>
                        <Tooltip content="Edit User">
                          <IconButton variant="text">
                            <PencilIcon className="size-4" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip content="Delete User">
                          <IconButton variant="text">
                            <TrashIcon className="size-4" />
                          </IconButton>
                        </Tooltip>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="w-full h-full flex flex-col place-content-center place-items-center">
              {loading ? (
                <Spinner className="size-12" />
              ) : (
                <div>
                  <XCircleIcon className="h-48 w-48" />
                  <Typography variant="h3">No Data Found</Typography>
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
                if (faculty.previous) {
                  fetchData(page - 1, search, sort, setLoading);
                }
              }}
              disabled={page === 1}
            >
              <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />
            </IconButton>
            <Typography color="gray" className="font-normal">
              Page <strong className="text-gray-900">{page}</strong> of{" "}
              <strong className="text-gray-900">{total_pages}</strong>
            </Typography>
            <IconButton
              size="sm"
              variant="outlined"
              onClick={() => {
                if (faculty.next) {
                  fetchData(page + 1, search, sort, setLoading);
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

export default Faculty;

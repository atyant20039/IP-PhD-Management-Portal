import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XCircleIcon,
  ChevronUpDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import {
  UserPlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";
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
  Select, // Import Select component
} from "@material-tailwind/react";

import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FacultyContext from "../context/FacultyContext";
import FilterDialog from "../components/ProfessorFIlterDialog";
import AddMemberDialog from "../components/AddMemberDialog";
import axios from "axios";

// Define the table head
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
  const [page, setPage] = useState(1);
  const [total_pages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name");
  const [isFilterDialogOpen, setFilterDialog] = useState(false);
  const [isAddDialogOpen, setAddDialog] = useState(false);
  const [filters, setFilters] = useState({});
  const [editableRow, setEditableRow] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [deleteConfirmation, setDeleteConfirmation] = useState(null); 
  const navigate = useNavigate();

  const API = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchData(page, search, sort, setLoading, filters);
    console.log(faculty);
  }, []);

  useEffect(() => {
    faculty && faculty.total_pages && setTotalPages(faculty.total_pages);
    faculty && faculty.page && setPage(faculty.page);
  }, [faculty]);

  useEffect(() => {
    fetchData(1, search, sort, setLoading, filters);
  }, [sort, filters]);

  useEffect(() => {
    const delay = 500;
    const timer = setTimeout(() => {
      fetchData(1, search, sort, setLoading, filters);
    }, delay);
    return () => clearTimeout(timer);
  }, [search, filters]);


  const handleFilterSelect = (selectedOptions) => {
    setFilters(selectedOptions);
  };

  const handleEdit = (index) => {
    setEditableRow(index);
    setEditedData({
      ...faculty.results[index],
    });
  };

  const handleConfirmEdit = async (index) => {
    console.log(index);
    try {
      const response = await axios.put(
        `${API}/api/instructor/${index}/`,
        editedData
      );
      console.log("Faculty member updated:", response.data);
      fetchData(page, search, sort, setLoading, filters);
      setEditableRow(null);
    } catch (error) {
      console.error("Error editing faculty member:", error);
    }
  };

  const confirmDelete = (id) => {
    setDeleteConfirmation(id);
  };

  const cancelDelete = () => {
    setDeleteConfirmation(null);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${API}/api/instructor/${id}/`
      );
      console.log("Faculty member deleted:", response.data);
      fetchData(page, search, sort, setLoading, filters);
      setDeleteConfirmation(null);
    } catch (error) {
      console.error("Error deleting faculty member:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen ml-4">
      <Card className="h-full w-full flex flex-1 flex-col relative">
        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-none mt-0 pt-4 "
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
                onApplyFilters={handleFilterSelect}
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
          {faculty && faculty.results && faculty.results.length !== 0 ? (
            <table className="w-full min-w-max table-auto text-left">
              <thead
                className={`sticky top-0 bg-white z-20 ${
                  deleteConfirmation ? "bg-black bg-opacity-5" : ""
                }`}
              >
                <tr>
                  {TABLE_HEAD.map(({ head, value }, index) => (
                    <th
                      key={head}
                      className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                      onClick={() =>
                        index !== TABLE_HEAD.length - 1 && setSort(value)
                      }
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                      >
                        {head}
                        {index !== TABLE_HEAD.length - 1 && (
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
                {faculty.results.map(
                  ({ name, emailId, department, id }, index) => {
                    const isLast = index === faculty.results.length - 1;
                    const classes = isLast
                      ? "p-4"
                      : "p-4 border-b border-blue-gray-50";

                    return (
                      <tr key={name} className="hover:bg-blue-gray-50">
                        <td className={classes}>
                          {editableRow === index ? (
                            <Input
                              value={editedData.name}
                              onChange={(e) =>
                                setEditedData({
                                  ...editedData,
                                  name: e.target.value,
                                })
                              }
                            />
                          ) : (
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal text-xs"
                            >
                              {name}
                            </Typography>
                          )}
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
                          {editableRow === index ? (
                            <select
                              value={editedData.department}
                              onChange={(e) =>
                                setEditedData({
                                  ...editedData,
                                  department: e.target.value,
                                })
                              }
                            >
                              {["CSE", "CB", "ECE", "HCD", "SSH", "MATHS"].map(
                                (option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                )
                              )}
                            </select>
                          ) : (
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal text-xs"
                            >
                              {department}
                            </Typography>
                          )}
                        </td>
                        <td className={classes}>
                          {editableRow === index ? (
                            <div>
                              <Tooltip content="Confirm Edit">
                                <IconButton
                                  variant="text"
                                  onClick={() => handleConfirmEdit(id)}
                                >
                                  <CheckCircleIcon className="size-4" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip content="Cancel Edit">
                                <IconButton
                                  variant="text"
                                  onClick={() => setEditableRow(null)}
                                >
                                  <XCircleIcon className="size-4" />
                                </IconButton>
                              </Tooltip>
                            </div>
                          ) : (
                            <div>
                              <Tooltip content="Edit User">
                                <IconButton
                                  variant="text"
                                  onClick={() => handleEdit(index)}
                                >
                                  <PencilIcon className="size-4" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip content="Delete User">
                                <IconButton
                                  variant="text"
                                  onClick={() => confirmDelete(id)}
                                >
                                  <TrashIcon className="size-4" />
                                </IconButton>
                              </Tooltip>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  }
                )}
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

      {deleteConfirmation && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <Typography variant="h5">Confirm Delete</Typography>
            <Typography className="mt-2">
              Are you sure you want to delete this faculty member?
            </Typography>
            <div className="mt-4 flex justify-end">
              <Button className="mr-4" onClick={() => cancelDelete()}>
                Cancel
              </Button>
              <Button
                color="red"
                onClick={() => handleDelete(deleteConfirmation)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Faculty;

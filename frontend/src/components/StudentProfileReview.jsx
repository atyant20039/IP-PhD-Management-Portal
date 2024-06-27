import { ChevronUpDownIcon, XCircleIcon } from "@heroicons/react/24/outline";
import {
  ArrowDownTrayIcon,
  PencilIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  IconButton,
  Spinner,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";

import DeleteDialog from "./DeleteDialog";
import YearlyReviewDialog from "./YearlyReviewDialog";

const TABLE_HEAD = [
  {
    head: "Date of Review",
    value: "dateOfReview",
  },
  {
    head: "Review Year",
    value: "reviewYear",
  },
  {
    head: "Comment",
    value: "comment",
  },
  {
    head: "File",
    value: "yearlyReviewFile",
  },
  {
    head: "",
    value: "",
  },
];

function StudentProfileReview({ rno, id }) {
  const [yearlyReviewData, setYearlyReviewData] = useState();
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("-dateOfReview");
  const [isDeleteDialogOpen, setDeleteDialog] = useState(false);
  const [isReviewFormOpen, setReviewForm] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const API = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API}/api/yearlyReview/?search=${rno}&ordering=${sort}`
        );
        setYearlyReviewData(response.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [sort, isDeleteDialogOpen, isReviewFormOpen]);

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

  const handleDelete = (row) => {
    setSelectedRow(row);
    setDeleteDialog(!isDeleteDialogOpen);
  };

  const handleForm = (row) => {
    setSelectedRow(row);
    setReviewForm(!isReviewFormOpen);
  };

  const handleDownload = async (fileUrl) => {
    try {
      const response = await axios.get(fileUrl, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileUrl.split("/").pop());
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error downloading the file: ", error);
    }
  };

  return (
    <Card shadow={false} className="h-full w-full flex">
      <CardBody className="p-0 overflow-y-auto flex-1">
        {yearlyReviewData && yearlyReviewData.length > 0 ? (
          <table className="w-full table-auto text-left">
            <thead className="sticky top-0 z-20 bg-white">
              <tr>
                {TABLE_HEAD.map(({ head, value }, index) => (
                  <th
                    key={head}
                    className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                    onClick={() =>
                      index != TABLE_HEAD.length - 1 &&
                      head != "File" &&
                      handleSort(value)
                    }
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                    >
                      {head}
                      {index !== TABLE_HEAD.length - 1 && head != "File" && (
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
              {yearlyReviewData.map((yearlyReview) => {
                const classes = "p-4 border-b border-blue-gray-50";
                return (
                  <tr key={yearlyReview.reviewYear}>
                    {TABLE_HEAD.map(({ head, value }, index) => {
                      if (head == "") return;
                      return (
                        <td key={head} className={classes}>
                          {head == "File" ? (
                            <Button
                              variant="outlined"
                              size="sm"
                              onClick={() =>
                                handleDownload(yearlyReview[value])
                              }
                            >
                              <div className="flex">
                                <ArrowDownTrayIcon className="size-4 mr-1" />
                                Download
                              </div>
                            </Button>
                          ) : (
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {yearlyReview[value] ? yearlyReview[value] : "-"}
                            </Typography>
                          )}
                        </td>
                      );
                    })}
                    <td className="p-4 border-b border-blue-gray-50 whitespace-nowrap">
                      <Tooltip content="Edit">
                        <IconButton
                          variant="text"
                          onClick={() => handleForm(yearlyReview)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip content="Delete">
                        <IconButton
                          variant="text"
                          onClick={() => handleDelete(yearlyReview)}
                        >
                          <TrashIcon className="size-4" />
                        </IconButton>
                      </Tooltip>
                    </td>
                  </tr>
                );
              })}
            </tbody>

            <DeleteDialog
              isOpen={isDeleteDialogOpen}
              setOpen={setDeleteDialog}
              row={selectedRow}
              model="yearlyReview"
            />
          </table>
        ) : (
          <div className="size-full flex flex-col place-content-center place-items-center">
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
      <YearlyReviewDialog
        isOpen={isReviewFormOpen}
        setOpen={setReviewForm}
        initVal={selectedRow}
        studentId={id}
      />
      <CardFooter className="flex justify-end p-1">
        <Button variant="outlined" size="sm" onClick={() => handleForm(null)}>
          <div className="flex">
            <PlusCircleIcon className="size-4 mr-1" />
            Add New Review
          </div>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default StudentProfileReview;

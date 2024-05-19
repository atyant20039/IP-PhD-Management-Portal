import { XCircleIcon } from "@heroicons/react/24/outline";
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

import ContingencyLogDialog from "./ContingencyLogDialog";
import DeleteDialog from "./DeleteDialog";

const TABLE_HEAD = [
  {
    head: "Item",
    value: "item",
  },
  {
    head: "Quantity",
    value: "quantity",
  },
  {
    head: "Price",
    value: "price",
  },
  {
    head: "Source",
    value: "source",
  },
  {
    head: "Credit",
    value: "credit",
  },
  {
    head: "Claim Amount",
    value: "claimAmount",
  },
  {
    head: "Santioned Amount",
    value: "santionedAmount",
  },
  {
    head: "Forwarded By",
    value: "forwardedBy",
  },
  {
    head: "Forwarded On",
    value: "forwardedOnDate",
  },
  {
    head: "Opening Balance",
    value: "openingBalance",
  },
  {
    head: "Opening Balance Date",
    value: "openingBalanceDate",
  },
  {
    head: "Closing Balance",
    value: "closingBalance",
  },
  {
    head: "Closing Balance Date",
    value: "closingBalanceDate",
  },
  {
    head: "Comment",
    value: "comment",
  },
  {
    head: "",
    value: "",
  },
];

function StudentProfileLog({ rno, id }) {
  const [contingencyLogData, setContingencyLogData] = useState();
  const [loading, setLoading] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialog] = useState(false);
  const [isContingencyLogFormOpen, setContingencyLogForm] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const API = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API}/api/contingencyLogs/?search=${rno}`
        );
        setContingencyLogData(response.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [isDeleteDialogOpen, isContingencyLogFormOpen]);

  const handleDelete = (row) => {
    setDeleteDialog(!isDeleteDialogOpen);
    setSelectedRow(row);
  };

  const handleForm = (row) => {
    setContingencyLogForm(!isContingencyLogFormOpen);
    setSelectedRow(row);
  };

  // const handleDownload = async (fileUrl) => {
  //   try {
  //     const response = await axios.get(fileUrl, {
  //       responseType: "blob",
  //     });
  //     const url = window.URL.createObjectURL(new Blob([response.data]));
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.setAttribute("download", fileUrl.split("/").pop());
  //     document.body.appendChild(link);
  //     link.click();
  //   } catch (error) {
  //     console.error("Error downloading the file: ", error);
  //   }
  // };

  return (
    <Card shadow={false} className="h-full w-full flex">
      <CardBody className="p-0 overflow-y-auto flex-1">
        {contingencyLogData && contingencyLogData.length > 0 ? (
          <table className="w-full table-auto text-left">
            <thead className="sticky top-0 z-20 bg-white">
              <tr>
                {TABLE_HEAD.map(({ head, value }, index) => (
                  <th
                    key={head}
                    className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {contingencyLogData.map((cLog) => {
                const classes = "p-4 border-b border-blue-gray-50";
                return (
                  <tr key={cLog.reviewYear}>
                    {TABLE_HEAD.map(({ head, value }, index) => {
                      if (head == "") return;
                      return (
                        <td key={head} className={classes}>
                          {head == "File" ? (
                            <Button
                              variant="outlined"
                              size="sm"
                              onClick={() => handleDownload(cLog[value])}
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
                              {cLog[value] ? cLog[value] : "-"}
                            </Typography>
                          )}
                        </td>
                      );
                    })}
                    <td className="p-4 border-b border-blue-gray-50 whitespace-nowrap">
                      <Tooltip content="Edit">
                        <IconButton
                          variant="text"
                          onClick={() => handleForm(cLog)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip content="Delete">
                        <IconButton
                          variant="text"
                          onClick={() => handleDelete(cLog)}
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
              model="contingencyLogs"
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
        <ContingencyLogDialog
          isOpen={isContingencyLogFormOpen}
          setOpen={setContingencyLogForm}
          initVal={selectedRow}
          studentId={id}
        />
      </CardBody>
      <CardFooter className="flex justify-end p-1">
        <Button variant="outlined" size="sm" onClick={() => handleForm(null)}>
          <div className="flex">
            <PlusCircleIcon className="size-4 mr-1" />
            Add New Log
          </div>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default StudentProfileLog;

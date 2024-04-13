import React, { useState } from 'react';import {
  Button,
  Input,
  Card,
  Typography,
  Tooltip,
  IconButton
} from "@material-tailwind/react";
import { UserPlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

const TABLE_HEAD = [
  {
    head: "Date",
    value: "date",
  },
  {
    head: "Day",
    value: "day",
  },
  {
    head: "Time",
    value: "time",
  },
  {
    head: "Acronym",
    value: "acronym",
  },
  {
    head: "Course Code",
    value: "courseCode",
  },
  {
    head: "Strength",
    value: "strength",
  },
  {
    head: "Room No.",
    value: "roomNo",
  },
];

function Invigilation_DateSheet({onSubmission}) {
  const [tableData, setTableData] = useState([
    { id: 1, date: '2/24/2024', day: 'Saturday', time: '10:00 AM - 11:00 AM', acronym: 'BDMH', courseCode: 'BIO543', strength: 127, roomNo: 'C101, LHC' },
    { id: 2, date: '2/24/2024', day: 'Saturday', time: '10:00 AM - 11:00 AM', acronym: 'CV', courseCode: 'CSE344/CSE544/ ECE344/ECE544', strength: 108, roomNo: 'C201, LHC' },
    { id: 3, date: '2/24/2024', day: 'Saturday', time: '10:00 AM - 11:00 AM', acronym: 'WCE', courseCode: 'ECE537', strength: 13, roomNo: 'C03, Old Acad' },
    { id: 4, date: '2/24/2024', day: 'Saturday', time: '10:00 AM - 11:00 AM', acronym: 'GDD', courseCode: 'DES512', strength: 23, roomNo: 'C02, Old Acad' },
    { id: 5, date: '2/24/2024', day: 'Saturday', time: '10:00 AM - 11:00 AM', acronym: 'SP', courseCode: 'PSY302', strength: 33, roomNo: 'C21, Old Acad' },
  ]);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    // Filter out the id field from each object in the tableData array
    const requestData = tableData.map(({ id, ...rest }) => rest);

    console.log(JSON.stringify(requestData));

    try {
      // Simulate response
      // const response = await fetch(`${API}/api/classroom/`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(requestData),
      // });

      // if (!response.ok) {
      //   throw new Error("Network response was not ok");
      // }

      setSubmitted(true);
      onSubmission()
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const handleAddRow = () => {
    setTableData(prevData => [
      ...prevData,
      { id: prevData.length + 1, date: '', day: '', time: '', acronym: '', courseCode: '', strength: '', roomNo: '', editing: true },
    ]);
  };

  const handleEdit = (rowId, column, value) => {
    setTableData(prevData =>
      prevData.map(row =>
        row.id === rowId ? { ...row, [column]: value } : row
      )
    );
  };

  const handleSave = (rowId) => {
    const newRow = tableData.find(row => row.id === rowId);
    if (!newRow.date || !newRow.day || !newRow.time || !newRow.acronym || !newRow.courseCode || !newRow.strength || !newRow.roomNo) {
      alert('Please fill in all the data fields.');
      return;
    }
    setTableData(prevData =>
      prevData.map(row =>
        row.id === rowId ? { ...row, editing: false } : row
      )
    );
  };

  const handleDelete = (rowId) => {
    setTableData(prevData => prevData.filter(row => row.id !== rowId));
  };

  return (
    <div className="flex justify-center mt-8">
      <div className="max-w-5xl ">
        <Button color="blue" onClick={handleAddRow}>
          <UserPlusIcon className="h-5 w-5" /> Add Another Row
        </Button>
        <Card className="mt-4">
          <table className="min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((header, index) => (
                  <th key={index} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                      {header.head}
                    </Typography>
                  </th>
                ))}
                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                  <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                    Actions
                  </Typography>
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData.map(row => (
                <tr key={row.id}>
                  {TABLE_HEAD.map((header, index) => (
                    <td key={index} className="p-4 border-b border-blue-gray-50">
                      {row.editing ? (
                        <Input
                          type="text"
                          value={row[header.value]}
                          onChange={(e) => handleEdit(row.id, header.value, e.target.value)}
                        />
                      ) : (
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {row[header.value]}
                        </Typography>
                      )}
                    </td>
                  ))}
                  <td className="p-4 border-b space-x-2 border-blue-gray-50">
                  {row.editing ? (
                      <>
                       <Tooltip content="Save User">
                          <IconButton variant="text">
                            <PencilIcon
                              className="size-4"
                              onClick={() => handleSave(row.id)}
                            />
                          </IconButton>
                        </Tooltip>
                      
                      </>
                    ) : (
                      <>
                        <Tooltip content="Edit User">
                          <IconButton variant="text">
                            <PencilIcon
                              className="size-4"
                              onClick={() => handleEdit(row.id, "editing", true)}
                            />
                          </IconButton>
                        </Tooltip>
                        <Tooltip content="Delete User">
                          <IconButton variant="text">
                            <TrashIcon
                              className="size-4"
                              onClick={() => handleDelete(row.id)}
                            />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        {!submitted && (
        <div className="mt-4">
          <Button color="blue" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      )}
      </div>
    
    </div>
  );
}

export default Invigilation_DateSheet;

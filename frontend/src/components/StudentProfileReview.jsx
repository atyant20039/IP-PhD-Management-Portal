import React, { useState,useEffect } from 'react';
import { Typography, Button, Dialog, DialogBody,DialogHeader, DialogFooter, Input } from "@material-tailwind/react";
import axios from 'axios'; // Import axios

const API = import.meta.env.VITE_BACKEND_URL;

function AddRowDialog({ isOpen, onClose, onSave, rowDataToEdit, tableHead }) {
  const [newRowData, setNewRowData] = useState(rowDataToEdit || {});

  useEffect(() => {
    // Update the new row data whenever the rowDataToEdit prop changes
    setNewRowData(rowDataToEdit || {});

    console.log(rowDataToEdit)
  }, [rowDataToEdit]);

  const handleCancel = () => {
    onClose(); 
    setNewRowData({});
  };

  const handleSave = () => {
    onSave(newRowData); 
    onClose(); 
    setNewRowData({});
  };

  const handleFileChange = (e) => {
    // Get the selected file
    const selectedFile = e.target.files[0];
    // Update the newRowData with the file name or other necessary information
    setNewRowData({ ...newRowData, file: selectedFile });
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogHeader>{rowDataToEdit ? 'Edit Row' : 'Add New Row'}</DialogHeader>
      <DialogBody>
        <div className="space-y-4">
          {tableHead.map(({ head, value }) => (
            <div key={value}>
              <label>{head}:</label>
              {value === 'file' ? ( 
                <input
                  type="file"
                  accept="application/pdf" 
                  onChange={handleFileChange}
                />
              ) : (
                <input
                  type={value === 'dateOfReview' ? 'date' : 'text'} // Adjust input type based on value
                  value={newRowData[value] || ''}
                  onChange={(e) => setNewRowData({ ...newRowData, [value]: e.target.value })}
                />
              )}
            </div>
          ))}
        </div>
      </DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          color="red"
          onClick={handleCancel}
          className="mr-1"
        >
          Cancel
        </Button>
        <Button variant="gradient" color="green" onClick={handleSave}>
          Save
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
  

const TABLE_HEAD = [
  {
    head: "Date",
    value: "dateOfReview",
  },
  {
    head: "File",
    value: "yearlyReviewreviewFile",
  },
  {
    head: "Review Year",
    value: "reviewYear"
  },
  {
    head: "Comment",
    value: "comment",
  },
  {
    head: "Actions",
    value: "actions",
  },
];

function StudentProfileReview({ id }) {
  const [data, setData] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rowDataToEdit, setRowDataToEdit] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API}/api/yearlyReview/?search=PhD20000`); // Use axios.get
        setData(response.data.results);
        console.log(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // Call the fetchData function
  }, [id]); // Add id to the dependency array to refetch data when id changes

  const handleAddRow = () => {
    setIsDialogOpen(true);
    setRowDataToEdit(null); // Reset row data to edit when adding a new row
  };

  const handleEditRow = (rowData) => {
    setIsDialogOpen(true);
    setRowDataToEdit(rowData); // Set the row data to be edited
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setRowDataToEdit(null); // Reset row data to edit when closing the dialog
  };

  const handleSaveRow = async (newRowData) => {
    console.log(newRowData);
    try {
      if (rowDataToEdit !== null) {
        // Update an existing row
        const response = await axios.put(`${API}/api/yearlyReview/${rowDataToEdit.id}`, newRowData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          console.log(response);
          throw new Error('Failed to update row');
        }
      } else {
        // Add a new row
        const response = await axios.post(`${API}/api/yearlyReview/`, {
          ...newRowData,
          studentId: id,
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to add new row');
        }
      }
  
      fetchData();
      setIsDialogOpen(false);
      setRowDataToEdit(null);
    } catch (error) {
      console.error('Error:', error);
      // Handle error
    }
  };
  
  return (
    <div className="w-90vw mx-auto">
      {data.length > 0 ? (
        <table className="w-full table-fixed text-left">
          <thead className="bg-blue-gray-50">
            <tr>
              {TABLE_HEAD.map(({ head }) => (
                <th key={head} className="border-b border-blue-gray-200 py-2 px-4">
                  <Typography variant="small" color="blue-gray" className="font-medium">
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-blue-gray-50">
                <td className="border-b border-blue-gray-200 py-2 px-4">
                  <Typography variant="body" className="text-sm">
                    {row.dateOfReview}
                  </Typography>
                </td>
                <td className="border-b border-blue-gray-200 py-2 px-4">
                  <a href={row.yearlyReviewreviewFile} target="_blank" rel="noopener noreferrer">
                    {row.yearlyReviewreviewFile}
                  </a>
                </td>
                <td className="border-b border-blue-gray-200 py-2 px-4">
                  <a href={row.reviewYear} target="_blank" rel="noopener noreferrer">
                    {row.reviewYear}
                  </a>
                </td>
                <td className="border-b border-blue-gray-200 py-2 px-4">
                  <Typography variant="body" className="text-sm">
                    {row.comment}
                  </Typography>
                </td>
                <td className="border-b border-blue-gray-200 py-2 px-4">
                  <div className="flex items-center space-x-2">
                    <button
                      className="text-blue-500"
                      onClick={() => handleEditRow(row)}
                    >
                      Edit
                    </button>
                    <button className="text-red-500">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <Typography variant="body">No data available</Typography>
      )}
      <Button onClick={handleAddRow}>Add New Row</Button>

      <AddRowDialog
  isOpen={isDialogOpen}
  onClose={handleCloseDialog}
  onSave={handleSaveRow}
  rowDataToEdit={rowDataToEdit}
  tableHead={TABLE_HEAD}
/>

    </div>
  );
}

export default StudentProfileReview;
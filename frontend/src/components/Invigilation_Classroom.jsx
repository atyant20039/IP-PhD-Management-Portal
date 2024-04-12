import { UserPlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import React, { useState,useEffect } from 'react';
import { Button, Input, Card, Typography } from '@material-tailwind/react';

function Invigilation_Classroom() {
  const [tableData, setTableData] = useState([
    { id: 1, column1: 'Data 1', column2: 'Data 2', column3: 'Data 3', editing: false },
    { id: 2, column1: 'Data 4', column2: 'Data 5', column3: 'Data 6', editing: false },
  ]);

  const API = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API}/api/classroom`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data)
      } catch (error) {
        console.error('Error fetching classroom data:', error);
      }
    };

    fetchData();
  }, [])
  

  const handleAddRow = () => {
    setTableData(prevData => [
      ...prevData,
      { id: prevData.length + 1, column1: '', column2: '', column3: '', editing: true },
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
    if (!newRow.column1 || !newRow.column2 || !newRow.column3) {
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
    <div className="mt-8 max-w-3xl mx-auto">
      <Button color="blue" onClick={handleAddRow}>
        <UserPlusIcon className="h-5 w-5 mr-2" /> Add Another Row
      </Button>
      <Card className="mt-4">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                  Column 1
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                  Column 2
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                  Column 3
                </Typography>
              </th>
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
                <td className="p-4 border-b border-blue-gray-50">
                  {row.editing ? (
                    <Input
                      type="text"
                      value={row.column1}
                      onChange={(e) => handleEdit(row.id, 'column1', e.target.value)}
                    />
                  ) : (
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {row.column1}
                    </Typography>
                  )}
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  {row.editing ? (
                    <Input
                      type="text"
                      value={row.column2}
                      onChange={(e) => handleEdit(row.id, 'column2', e.target.value)}
                    />
                  ) : (
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {row.column2}
                    </Typography>
                  )}
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  {row.editing ? (
                    <Input
                      type="text"
                      value={row.column3}
                      onChange={(e) => handleEdit(row.id, 'column3', e.target.value)}
                    />
                  ) : (
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {row.column3}
                    </Typography>
                  )}
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  {row.editing ? (
                    <>
                      <Button color="blue" onClick={() => handleSave(row.id)}>
                        <PencilIcon className="h-5 w-5" />
                      </Button>
                      <Button color="red" onClick={() => handleDelete(row.id)}>
                        <TrashIcon className="h-5 w-5" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button  onClick={() => handleEdit(row.id, 'column1', 'edited')}>
                        <PencilIcon className="h-5 w-5" />
                      </Button>
                      <Button conClick={() => handleDelete(row.id)}>
                        <TrashIcon className="h-5 w-5" />
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

export default Invigilation_Classroom;

import * as XLSX from "xlsx";

function convertDataToXLSX(data) {
  // Convert JSON data to worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Create a new workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Write the workbook to a binary string
  const workbookBinaryString = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "binary",
  });

  // Convert the binary string to a Blob
  const workbookBlob = new Blob([s2ab(workbookBinaryString)], {
    type: "application/octet-stream",
  });

  // Create a File from the Blob
  const file = new File([workbookBlob], "Classroom.xlsx", {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  // Trigger the download
  // const url = URL.createObjectURL(workbookBlob);
  // const link = document.createElement('a');
  // link.href = url;
  // link.setAttribute('download', "DataSheet.xlsx");
  // document.body.appendChild(link);
  // link.click();
  // document.body.removeChild(link);
  // URL.revokeObjectURL(url);
  // to check the file conversion download automatically
  return file;
}

// Helper function to convert string to ArrayBuffer
function s2ab(s) {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
  return buf;
}

export default convertDataToXLSX;

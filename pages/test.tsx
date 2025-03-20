"use client"; // Required for Next.js PWA

import { useState } from "react";
import * as XLSX from "xlsx";

export default function AttendanceUploader() {
  const [attendees, setAttendees] = useState<string[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (e) => {
      const binaryString = e.target?.result as string;
      const workbook = XLSX.read(binaryString, { type: "binary" });

      // Select the correct sheet
      const sheetName = "For import";
      const sheet = workbook.Sheets[sheetName];

      if (!sheet) {
        alert(`Sheet '${sheetName}' not found in the Excel file.`);
        return;
      }

      // Convert sheet to 2D array
      const jsonData: string[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][];

      // Find the row containing headers ("Status" & "Navn")
      const headersRow = jsonData.findIndex(
        (row) => Array.isArray(row) && row.includes("Status") && row.includes("Navn")
      );

      if (headersRow === -1) {
        alert("Could not find the headers 'Status' and 'Navn' in the sheet.");
        return;
      }

      // Get column indexes
      const headers = jsonData[headersRow];
      const statusIndex = headers.indexOf("Status");
      const nameIndex = headers.indexOf("Navn");

      if (statusIndex === -1 || nameIndex === -1) {
        alert("Missing 'Status' or 'Navn' columns in the sheet.");
        return;
      }

      // Extract attendees (people with "Kommer" in "Status")
      const extractedAttendees = jsonData
        .slice(headersRow + 1) // Skip headers
        .filter((row) => row[statusIndex] === "Kommer") // Filter by status
        .map((row) => row[nameIndex]) // Extract names
        .filter((name): name is string => typeof name === "string"); // Ensure valid strings

      setAttendees(extractedAttendees);
    };
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Upload Attendance List</h1>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="mb-4" />
      
      {attendees.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Attendees:</h2>
          <ul className="list-disc pl-5">
            {attendees.map((name, index) => (
              <li key={index}>{name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

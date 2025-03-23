import React, { useState } from 'react';
import { generatePDF } from './pdfGenerator';
import './App.css';
import { useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from "jspdf";
import "jspdf-autotable"; // This injects the autoTable plugin into jsPDF

const studentsData = [
  {
    rollNo: '001',
    name: 'John Doe',
    attendance: [90, 85, 88, 92, 87], // Attendance for 5 theory subjects
    labAttendance: 95,
    ia1: 18,
    ia2: 19,
    ese: 75,
    assignments: [
      { assignmentNo: 1, marks: 20 },
      { assignmentNo: 2, marks: 18 },
    ],
    practicals: [
      { practicalNo: 1, grade: 'A' },
      { practicalNo: 2, grade: 'B' },
    ],
  },
  // Add more students
];

const App = () => {
  const [students] = useState(studentsData);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Calculate IA average (converted to 20 marks)
  const calculateIAAverage = (ia1, ia2) => {
    return ((ia1 + ia2) / 2).toFixed(2);
  };

  // Calculate total marks (IA avg + ESE)
  const calculateTotal = (ia1, ia2, ese) => {
    const iaAvg = calculateIAAverage(ia1, ia2);
    return (parseFloat(iaAvg) + ese).toFixed(2);
  };

  return (
    <div className="App">
      <h1>Student Result System</h1>
      <div className="student-list">
        <select onChange={(e) => setSelectedStudent(students[e.target.value])}>
          <option value="">Select Student</option>
          {students.map((student, index) => (
            <option key={index} value={index}>
              {student.name} (Roll No: {student.rollNo})
            </option>
          ))}
        </select>
      </div>

      {selectedStudent && (
        <div className="student-details">
          {/* Student Info */}
          <div className="section">
            <h2>Student Information</h2>
            <p>Roll No: {selectedStudent.rollNo}</p>
            <p>Name: {selectedStudent.name}</p>
          </div>

          {/* Attendance */}
          <div className="section">
            <h2>Theory Attendance (%)</h2>
            <ul>
              {selectedStudent.attendance.map((att, index) => (
                <li key={index}>Subject {index + 1}: {att}%</li>
              ))}
            </ul>
            <p>Lab Attendance: {selectedStudent.labAttendance}%</p>
          </div>

          {/* Marks */}
          <div className="section">
            <h2>Marks</h2>
            <p>IA1: {selectedStudent.ia1}/20</p>
            <p>IA2: {selectedStudent.ia2}/20</p>
            <p>IA Average: {calculateIAAverage(selectedStudent.ia1, selectedStudent.ia2)}/20</p>
            <p>ESE: {selectedStudent.ese}/80</p>
            <p>Total: {calculateTotal(selectedStudent.ia1, selectedStudent.ia2, selectedStudent.ese)}/100</p>
          </div>

          {/* Assignments */}
          <div className="section">
            <h2>Assignments</h2>
            <table>
              <thead>
                <tr>
                  <th>Assignment No.</th>
                  <th>Marks</th>
                </tr>
              </thead>
              <tbody>
                {selectedStudent.assignments.map((assignment) => (
                  <tr key={assignment.assignmentNo}>
                    <td>{assignment.assignmentNo}</td>
                    <td>{assignment.marks}/20</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Practicals */}
          <div className="section">
            <h2>Practicals</h2>
            <table>
              <thead>
                <tr>
                  <th>Practical No.</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {selectedStudent.practicals.map((practical) => (
                  <tr key={practical.practicalNo}>
                    <td>{practical.practicalNo}</td>
                    <td>{practical.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PDF Generator Button */}
          <button onClick={() => generatePDF(selectedStudent)}>
            Generate PDF
          </button>
        </div>
      )}
    </div>
  );
};

function Apps() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Fetch students from Flask API
  useEffect(() => {
    axios.get('http://localhost:5000/students')
      .then((res) => setStudents(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      {/* Dropdown to select student */}
      <select onChange={(e) => setSelectedStudent(students[e.target.value])}>
        {students.map((student, index) => (
          <option key={index} value={index}>
            {student.name} ({student.roll_no})
          </option>
        ))}
      </select>

      {/* Display selected student data */}
      {selectedStudent && (
        <div>
          <h2>{selectedStudent.name}'s Details</h2>
          <p>Email: {selectedStudent.email}</p>
          <p>IA1: {selectedStudent.ia1}/20</p>
          <p>IA2: {selectedStudent.ia2}/20</p>
        </div>
      )}
    </div>
    
  );
  }





export default App;
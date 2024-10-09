import React from "react";
import { Routes, Route } from "react-router-dom";
import TodaysAttendance from "./TodaysAttendance";
import ManageAttendance from "./ManageAttendance";
import AttendanceManagerLayout from "./AttendanceManagerLayout";
import ViewAttendance from "./ViewAttendance";

const AttendanceManager = () => {
  return (
    <Routes>
      {/* Main route that renders the layout with the sidebar */}
      <Route path="/" element={<AttendanceManagerLayout />}>
        {/* Nested routes inside AttendanceManagerLayout */}
        <Route index element={<TodaysAttendance />} />
        <Route path="manage-attendance" element={<ManageAttendance />} />
        <Route path="View-attendance" element={<ViewAttendance />} />

      </Route>
    </Routes>
  );
};

export default AttendanceManager;

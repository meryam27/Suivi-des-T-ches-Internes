import React, { use } from "react";
import axios from "axios";
import { useEffect, useState } from "react";
const EmployDetail = ({ showDetail, setShowDetail }) => {
  useEffect(() => {
    axios.get("http://localhost:5001/api/employees");
  }, []);
  return <div></div>;
};

export default EmployDetail;

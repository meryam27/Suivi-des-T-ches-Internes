import { Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/employe/Navbar";
import DashboardEmploye from "./components/employe/DashboardEmploye";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<DashboardEmploye />} />
      </Routes>
    </>
  );
}

export default App;

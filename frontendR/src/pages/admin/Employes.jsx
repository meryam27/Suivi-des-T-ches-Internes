import React, { useEffect, useState } from "react";
import EmployeCard from "../../components/admin/EmployeCard";
import "../../components/admin/EmployeCard.css";
import axios from "axios";
import { FiSearch } from "react-icons/fi"; // Import de l'icône de recherche

const Employes = () => {
  const [employes, setEmployes] = useState([]);
  const [filteredEmployes, setFilteredEmployes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/admin/employees", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setEmployes(res.data);
        setFilteredEmployes(res.data);
      })
      .catch((err) => {
        console.error("Error fetching employes:", err);
      });
  }, []);
  console.log("Employes:", employes);
  useEffect(() => {
    const results = employes.filter(
      (employe) =>
        (employe.name &&
          employe.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (employe.prenom &&
          employe.prenom.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (employe.position &&
          employe.position.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredEmployes(results);
  }, [searchTerm, employes]);

  return (
    <div className="employes-page">
      <h1 className="employe-page-title">Employés</h1>

      {/* Barre de recherche */}
      <div className="search-container">
        <div className="search-input-wrapper">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher par nom, prénom ou poste..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="employe-list">
        {filteredEmployes.length > 0 ? (
          filteredEmployes.map((employe) => (
            <EmployeCard
              key={employe.id}
              employe={employe}
              onClick={() => console.log(`Clicked on ${employe.name}`)}
            />
          ))
        ) : (
          <div className="no-results">
            <p>Aucun employé trouvé pour "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Employes;

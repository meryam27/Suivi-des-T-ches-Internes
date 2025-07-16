// components/admin/EmployeCard.jsx
import React from "react";
import "./EmployeCard.css"; // importe le fichier CSS
import defaultAvatar from "../../assets/images/default-avatar.png";

const EmployeCard = ({ employe, onClick }) => {
  return (
    <div className="employe-card" onClick={onClick}>
      <div className="employe-avatar">
        <img src={employe.profilePhoto || defaultAvatar} alt="Profil" />
      </div>
      <h3 className="employe-name">{employe.name}</h3>
      <p className="employe-position">{employe.position}</p>
    </div>
  );
};

export default EmployeCard;

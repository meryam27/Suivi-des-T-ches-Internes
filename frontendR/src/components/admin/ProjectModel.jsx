import React from "react";
import "./ProjectModal.css";
import defaultProject from "../../assets/images/project-default.jpg";
import defaultProfil from "../../assets/images/profil-default.jpeg";

const ProjectModal = ({ project, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>

        <div className="modal-header">
          <img
            src={project.logo || defaultProject}
            alt="Logo du projet"
            className="modal-logo"
          />
          <div>
            <h2 className="modal-title">{project.name}</h2>
            <p className="modal-subtitle">
              {project.company} • {project.city}
            </p>
          </div>
        </div>

        <p className="modal-description">
          {project.description || "Aucune description disponible."}
        </p>

        <div className="modal-section">
          <strong>Status :</strong>{" "}
          <span className={`badge status ${project.status}`}>
            {project.status}
          </span>
        </div>

        <div className="modal-section">
          <strong>Priorité :</strong>{" "}
          <span className={`badge priority ${project.priority}`}>
            {project.priority}
          </span>
        </div>

        <div className="modal-section">
          <strong>Progression :</strong>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${project.progression}%` }}
            ></div>
          </div>
          <span>{project.progression}%</span>
        </div>

        <div className="modal-section">
          <strong>Équipe assignée :</strong>
          <div className="modal-avatars">
            {Array.isArray(project.assignedEmployees) &&
            project.assignedEmployees.length > 0 ? (
              project.assignedEmployees.map((photo, index) => {
                const isValid =
                  photo && typeof photo === "string" && photo.trim() !== "";
                return (
                  <img
                    key={index}
                    src={isValid ? photo : defaultProfil}
                    alt="Employé"
                    className="modal-avatar"
                  />
                );
              })
            ) : (
              <img
                src={defaultProfil}
                alt="Aucun employé"
                className="modal-avatar"
              />
            )}
          </div>
          <span className="employee-count">
            {project.assignedEmployees?.length || 0} membre(s)
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;

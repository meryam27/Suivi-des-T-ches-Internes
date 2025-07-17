import React, { useState } from "react";
import "./ProjectCard.css";
import defaultProject from "../../assets/images/project-default.jpg";
import defaultProfil from "../../assets/images/profil-default.jpeg";
import ProjectModal from "./ProjectModel";
import FormulaireProjetUpdate from "./FormulaireProjetUpdate";
import { FiTrash2, FiEdit } from "react-icons/fi";
import axios from "axios";

const ProjectCard = ({ project, onProjectDeleted, onProjectUpdated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const token = localStorage.getItem("token");

  const handleCardClick = (e) => {
    if (e.target.closest(".edit-icon, .delete-icon")) return;
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(
        `http://localhost:5001/api/admin/projects/${project._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (onProjectDeleted) onProjectDeleted(project._id);
    } catch (error) {
      console.error("Erreur complète:", error);
      console.error("Response data:", error.response?.data);
      console.error("Status code:", error.response?.status);
      console.error("Headers:", error.response?.headers);
    } finally {
      setIsDeleting(false);
      setShowConfirmDelete(false);
    }
  };
  console.log("token", token);

  const handleUpdate = (e) => {
    e.stopPropagation();
    setIsFormOpen(true);
    setIsModalOpen(false);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowConfirmDelete(true);
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
  };

  return (
    <>
      <div className="project-card" onClick={handleCardClick}>
        <div className="project-card-header">
          <img
            src={project.logoUrl || defaultProject}
            alt="Logo du projet"
            className="project-logo"
          />
          <div className="project-info">
            <h3 className="project-title">{project.name}</h3>
            <p className="project-company">
              {project.company} • {project.city}
            </p>
          </div>
        </div>

        <div className="project-actions">
          <FiEdit
            className="edit-icon"
            onClick={handleUpdate}
            title="Modifier"
          />
          <FiTrash2
            className="delete-icon"
            onClick={handleDeleteClick}
            title="Supprimer"
          />
        </div>

        <div className="project-status">
          <span className={`badge status ${project.status}`}>
            {project.status}
          </span>
          <span className={`badge priority ${project.priority}`}>
            {project.priority}
          </span>
        </div>

        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${project.progression}%` }}
            ></div>
          </div>
          <span className="progress-text">{project.progression}%</span>
        </div>

        <div className="assigned-employees">
          <div className="avatars">
            {Array.isArray(project.assignedEmployees) &&
            project.assignedEmployees.length > 0 ? (
              project.assignedEmployees.map((photo, index) => {
                const isValid =
                  photo && typeof photo === "string" && photo.trim() !== "";
                return (
                  <img
                    key={index}
                    src={isValid ? project.logo : defaultProfil}
                    alt="Employé"
                    className="employee-avatar"
                  />
                );
              })
            ) : (
              <img
                src={defaultProfil}
                alt="Aucun employé"
                className="employee-avatar"
              />
            )}
          </div>
          <span className="employee-count">
            {project.assignedEmployees?.length || 0} membre(s)
          </span>
        </div>
      </div>

      {/* Modal de visualisation */}
      {isModalOpen && (
        <ProjectModal
          project={project}
          onClose={() => setIsModalOpen(false)}
          onUpdate={onProjectUpdated}
        />
      )}

      {/* Formulaire de modification */}
      {isFormOpen && (
        <FormulaireProjetUpdate
          projectToUpdate={project}
          onClose={() => setIsFormOpen(false)}
          onUpdateSuccess={onProjectUpdated}
        />
      )}

      {/* Confirmation suppression */}
      {showConfirmDelete && (
        <div className="confirm-delete-overlay">
          <div className="confirm-delete-modal">
            <div className="confirm-box">
              <p>Voulez-vous vraiment supprimer ce projet ?</p>
              <div className="confirm-buttons">
                <button
                  onClick={handleDelete}
                  className="confirm-btn delete"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Suppression..." : "Supprimer"}
                </button>
                <button
                  onClick={handleCancelDelete}
                  className="confirm-btn cancel"
                  disabled={isDeleting}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectCard;

import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FormulaireProjet = ({
  setShowModal,
  newProject,
  setNewProject,
  setSuccess,
  setError,
  error,
  success,
}) => {
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setNewProject((prev) => ({ ...prev, logo: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("name", newProject.name);
    formData.append("description", newProject.description);
    formData.append("company", newProject.company);
    formData.append("city", newProject.city);
    formData.append("status", newProject.status);
    formData.append("startDate", newProject.startDate);
    formData.append("priority", newProject.priority);
    formData.append("logo", newProject.logo);

    newProject.employees.forEach((employeeId) =>
      formData.append("employees", employeeId)
    );

    try {
      await axios.post(
        "http://localhost:5001/api/admin/projects/ajout",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccess("Projet ajouté avec succès!");
      setNewProject({
        name: "",
        description: "",
        company: "",
        city: "",
        status: "active",
        startDate: "",
        employees: [],
        logo: null,
        priority: "medium",
      });
      setShowModal(false);
      setTimeout(() => window.location.reload(), 500);
    } catch (err) {
      console.error("Erreur lors de l'ajout du projet:", err);
      setError(
        err.response?.data?.message || "Erreur lors de l'ajout du projet"
      );
    }
  };

  const navigateToEmployees = () => {
    navigate("/admin/employees");
  };

  return (
    <div className="modal-overlay">
      <div className="project-modal">
        <div className="modal-header">
          <h2 className="new-project">Nouveau Projet</h2>
          <button className="close-btn" onClick={() => setShowModal(false)}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="project-form">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="form-group">
            <label>Nom du projet</label>
            <input
              type="text"
              name="name"
              value={newProject.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={newProject.description}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Entreprise</label>
              <input
                type="text"
                name="company"
                value={newProject.company}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Ville</label>
              <input
                type="text"
                name="city"
                value={newProject.city}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Statut</label>
              <select
                name="status"
                value={newProject.status}
                onChange={handleInputChange}
              >
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
                <option value="completed">Terminé</option>
              </select>
            </div>

            <div className="form-group">
              <label>Priorité</label>
              <select
                name="priority"
                value={newProject.priority}
                onChange={handleInputChange}
              >
                <option value="high">Haute</option>
                <option value="medium">Moyenne</option>
                <option value="low">Basse</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Date de début</label>
            <input
              type="date"
              name="startDate"
              value={newProject.startDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Employés assignés</label>
            <button
              type="button"
              className="employee-select-btn"
              onClick={navigateToEmployees}
            >
              Sélectionner des employés
            </button>
          </div>

          <div className="form-group">
            <label>Logo du projet</label>
            <div className="file-input-container">
              <input
                type="file"
                id="logo-upload"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input"
              />
              <label htmlFor="logo-upload" className="file-input-label">
                {newProject.logo ? newProject.logo.name : "Choisir un fichier"}
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setShowModal(false)}
            >
              Annuler
            </button>
            <button type="submit" className="submit-btn">
              Créer le projet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormulaireProjet;

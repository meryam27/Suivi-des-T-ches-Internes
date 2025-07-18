import React, { useState, useEffect } from "react";
import axios from "axios";
import ModalEmployes from "../../pages/admin/ModalEmployes.jsx";
import "./FormulaireProjet.css";

const initialState = {
  name: "",
  description: "",
  company: "",
  city: "",
  status: "active",
  priority: "medium",
  startDate: "",
  endDate: "",
  assignedEmployeesCINs: [],
  assignedEmployeesPreview: [],
  logo: null,
};

const FormulaireProjet = ({
  setShowModal,
  newProject,
  setNewProject,
  setSuccess,
  setError,
  error,
  success,
}) => {
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [employeesList, setEmployeesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const t = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5001/api/admin/employees",
          { headers: { Authorization: `Bearer ${t}` } }
        );
        setEmployeesList(res.data.data || []);
      } catch {
        setError("Erreur chargement employés");
      }
    })();
  }, []);

  const handleInputChange = (e) =>
    setNewProject((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleFileChange = (e) =>
    setNewProject((prev) => ({ ...prev, logo: e.target.files[0] }));

  const handleAddEmployees = (sel) => {
    const CINs = sel.map((e) => e.cin);
    setNewProject((prev) => ({
      ...prev,
      assignedEmployeesCINs: CINs,
      assignedEmployeesPreview: sel,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!newProject.name || !newProject.company || !newProject.city) {
      setError("Nom, Entreprise, Ville requis");
      setIsLoading(false);
      return;
    }

    const form = new FormData();
    [
      "name",
      "description",
      "company",
      "city",
      "status",
      "priority",
      "startDate",
      "endDate",
    ].forEach((f) => form.append(f, newProject[f] || ""));
    newProject.assignedEmployeesCINs.forEach((cin) =>
      form.append("assignedEmployeesCINs[]", cin)
    );
    if (newProject.logo) form.append("logo", newProject.logo);

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5001/api/admin/projects/ajout", form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccess("Projet créé !");
      setNewProject(initialState);
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur création projet");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => setNewProject(initialState);

  return (
    <div className="modal-overlay">
      {showEmployeeModal && (
        <ModalEmployes
          employes={employeesList}
          onClose={() => setShowEmployeeModal(false)}
          onAddEmployes={handleAddEmployees}
        />
      )}
      <div className="project-modal">
        <div className="modal-header">
          <h2>Nouveau Projet</h2>
          <button
            className="close-btn"
            onClick={() => {
              setShowModal(false);
              resetForm();
            }}
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="project-form">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="form-group">
            <label>Nom du projet *</label>
            <input
              type="text"
              name="name"
              value={newProject.name}
              onChange={handleInputChange}
              required
              placeholder="Nom du projet"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={newProject.description}
              onChange={handleInputChange}
              placeholder="Description du projet..."
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Entreprise *</label>
              <input
                type="text"
                name="company"
                value={newProject.company}
                onChange={handleInputChange}
                required
                placeholder="Nom de l'entreprise"
              />
            </div>

            <div className="form-group">
              <label>Ville *</label>
              <input
                type="text"
                name="city"
                value={newProject.city}
                onChange={handleInputChange}
                required
                placeholder="Ville du projet"
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
                <option value="pending">En attente</option>
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

          <div className="form-row">
            <div className="form-group">
              <label>Date de début</label>
              <input
                type="date"
                name="startDate"
                value={newProject.startDate}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Date de fin</label>
              <input
                type="date"
                name="endDate"
                value={newProject.endDate || ""}
                onChange={handleInputChange}
                min={newProject.startDate}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Employés assignés</label>
            <div className="employee-selection">
              <button
                type="button"
                className="employee-select-btn"
                onClick={() => setShowEmployeeModal(true)}
              >
                {newProject.assignedEmployeesPreview?.length > 0
                  ? `${newProject.assignedEmployeesPreview.length} employé(s) sélectionné(s)`
                  : "Sélectionner des employés"}
              </button>

              {newProject.assignedEmployeesPreview?.length > 0 && (
                <div className="selected-employees-preview">
                  {newProject.assignedEmployeesPreview
                    .slice(0, 3)
                    .map((emp, index) => (
                      <div key={index} className="employee-preview">
                        <img
                          src={emp.profilePhoto || "/default-avatar.png"}
                          alt={emp.name}
                        />
                        <span>{emp.name}</span>
                      </div>
                    ))}
                  {newProject.assignedEmployeesPreview?.length > 3 && (
                    <div className="more-employees">
                      +{newProject.assignedEmployeesPreview.length - 3} autres
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Logo du projet</label>
            <div className="file-upload-container">
              <label className="file-upload-label">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-upload-input"
                />
                <span className="file-upload-button">
                  {newProject.logo ? "Changer de fichier" : "Choisir un logo"}
                </span>
                <span className="file-upload-name">
                  {newProject.logo?.name || "Aucun fichier sélectionné"}
                </span>
              </label>
              {newProject.logo && (
                <button
                  type="button"
                  className="file-upload-remove"
                  onClick={() =>
                    setNewProject((prev) => ({ ...prev, logo: null }))
                  }
                >
                  ×
                </button>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
              disabled={isLoading}
            >
              Annuler
            </button>
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? "Création en cours..." : "Créer le projet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormulaireProjet;

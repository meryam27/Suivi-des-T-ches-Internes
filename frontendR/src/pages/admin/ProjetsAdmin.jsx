import React, { useEffect, useState } from "react";
import axios from "axios";
import ProjectCard from "../../components/admin/ProjectCard";
import { FiSearch, FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import FormulaireProjet from "../../components/admin/FormulaireProjet";

import "../../index.css";

const ProjetsAdmin = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({
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
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          "http://localhost:5001/api/admin/projects/cards",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProjects(res.data);
        setFilteredProjects(res.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Erreur récupération projets :", err);
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    let result = [...projects];

    if (filterStatus !== "all") {
      result = result.filter((project) => project.status === filterStatus);
    }

    if (filterPriority !== "all") {
      result = result.filter((project) => project.priority === filterPriority);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (project) =>
          project.name.toLowerCase().includes(term) ||
          (project.company && project.company.toLowerCase().includes(term)) ||
          (project.city && project.city.toLowerCase().includes(term))
      );
    }

    if (sortOption) {
      switch (sortOption) {
        case "name":
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "company":
          result.sort((a, b) => a.company.localeCompare(b.company));
          break;
        case "city":
          result.sort((a, b) => a.city.localeCompare(b.city));
          break;
        case "status":
          result.sort((a, b) => a.status.localeCompare(b.status));
          break;
        case "priority":
          const priorityOrder = { high: 1, medium: 2, low: 3 };
          result.sort(
            (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
          );
          break;
        default:
          break;
      }
    }

    setFilteredProjects(result);
  }, [projects, searchTerm, sortOption, filterStatus, filterPriority]);

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setNewProject((prev) => ({ ...prev, [name]: value }));
  // };

  // const handleFileChange = (e) => {
  //   setNewProject((prev) => ({ ...prev, logo: e.target.files[0] }));
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const token = localStorage.getItem("token");

  //   const formData = new FormData();
  //   formData.append("name", newProject.name);
  //   formData.append("description", newProject.description);
  //   formData.append("company", newProject.company);
  //   formData.append("city", newProject.city);
  //   formData.append("status", newProject.status);
  //   formData.append("startDate", newProject.startDate);
  //   formData.append("priority", newProject.priority);
  //   formData.append("logo", newProject.logo);

  //   newProject.employees.forEach((employeeId) =>
  //     formData.append("employees", employeeId)
  //   );

  //   try {
  //     const response = await axios.post(
  //       "http://localhost:5001/api/admin/projects/ajout",
  //       formData,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );

  //     setSuccess("Projet ajouté avec succès!");

  //     // Réinitialiser le formulaire
  //     setNewProject({
  //       name: "",
  //       description: "",
  //       company: "",
  //       city: "",
  //       status: "active",
  //       startDate: "",
  //       employees: [],
  //       logo: null,
  //       priority: "medium",
  //     });

  //     // Fermer la modale
  //     setShowModal(false);

  //     // Attendre un court instant puis recharger la page pour afficher les nouveaux projets
  //     setTimeout(() => {
  //       window.location.reload();
  //     }, 500);
  //   } catch (err) {
  //     console.error("Erreur lors de l'ajout du projet:", err);
  //     setError(
  //       err.response?.data?.message || "Erreur lors de l'ajout du projet"
  //     );
  //   }
  // };

  // const navigateToEmployees = () => {
  //   navigate("/admin/employees");
  // };

  if (isLoading) {
    return <div className="projets loading">Chargement des projets...</div>;
  }

  return (
    <div className="projets">
      <button className="add-project-btn" onClick={() => setShowModal(true)}>
        <FiPlus className="add-icon" />
      </button>

      {showModal && (
        <FormulaireProjet
          setShowModal={setShowModal}
          newProject={newProject}
          setNewProject={setNewProject}
          setSuccess={setSuccess}
          setError={setError}
          error={error}
          success={success}
        />
      )}

      <h1 className="projet-page-title">Projets</h1>

      <div className="search-filter-container">
        <div className="search-wrapper">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher projets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-wrapper">
          <div className="custom-select">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">📊 Tous statuts</option>
              <option value="active">🟢 Actif</option>
              <option value="inactive">⚪ Inactif</option>
              <option value="completed">✅ Terminé</option>
            </select>
          </div>

          <div className="custom-select">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="filter-select"
            >
              <option value="all">🎯 Toutes priorités</option>
              <option value="high">🔴 Haute</option>
              <option value="medium">🟡 Moyenne</option>
              <option value="low">🟢 Basse</option>
            </select>
          </div>

          <div className="custom-select">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="sort-select"
            >
              <option value="">🔃 Trier par</option>
              <option value="name"> Nom</option>
              <option value="company"> Entreprise</option>
              <option value="city"> Ville</option>
              <option value="status"> Statut</option>
              <option value="priority"> Priorité</option>
            </select>
          </div>
        </div>
      </div>

      <div className="project-container">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))
        ) : (
          <p className="no-projects">Aucun projet trouvé.</p>
        )}
      </div>
    </div>
  );
};

export default ProjetsAdmin;

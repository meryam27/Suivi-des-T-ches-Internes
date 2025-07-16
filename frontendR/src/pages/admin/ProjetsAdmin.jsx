import React, { useEffect, useState } from "react";
import axios from "axios";
import ProjectCard from "../../components/admin/ProjectCard";
import "../../index.css"; // Assurez-vous que le chemin est correct pour le CSS global
// si tu veux un style global à cette page

const ProjetsAdmin = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // 👈 Ajout état de chargement

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:5001/api/admin/projects/cards", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setProjects(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Erreur récupération projets :", err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div className="projets loading">Chargement des projets...</div>;
  }

  return (
    <div className="projets">
      <h1 className="projet-page-title">Projets</h1>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          padding: "20px",
        }}
        className="project-container"
      >
        {projects.length > 0 ? (
          projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))
        ) : (
          <p>Aucun projet trouvé.</p>
        )}
      </div>
    </div>
  );
};

export default ProjetsAdmin;

import React, { useEffect, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
  Legend,
  BarChart,
  XAxis,
  YAxis,
  Bar,
} from "recharts";
import axios from "axios";

const COLORS = ["#fdce11ff", "#74b2feff", "#34d399", "#fe8989ff"];
const COLORS2 = ["#74b2feff", "#34d399", "#fe8989ff"];

const DashboardAdminComp = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 🔁 Vérifie s’il y a des données en cache
    const cached = localStorage.getItem("dashboardStats");
    if (cached) {
      setStats(JSON.parse(cached));
      setIsLoading(false);
    }

    // 🔄 Toujours recharger à jour depuis l’API
    axios
      .get("http://localhost:5001/api/admin/dashboard/stats", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setStats(res.data);
        localStorage.setItem("dashboardStats", JSON.stringify(res.data));
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Erreur récupération stats :", err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading || !stats) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <i
          className="fas fa-spinner fa-spin"
          style={{ fontSize: "30px", color: "#60a5fa" }}
        ></i>
        <p>Chargement des statistiques...</p>
      </div>
    );
  }

  // 📊 Données
  const longTasksStats = stats.tasks.stats.find((s) => s.type === "long") || {};
  const dailyTasksStats = stats.tasks.dailyProgression || [];
  console.log("acti", stats.activities);
  const pieDataDaily = [
    { name: "À faire", value: longTasksStats.pending || 0 },
    { name: "En cours", value: longTasksStats.inProgress || 0 },
    { name: "Terminée", value: longTasksStats.completed || 0 },
    { name: "En retard", value: longTasksStats.late || 0 },
  ];

  const projectData = stats.projects;
  const pieProject = [
    { name: "Actif", value: projectData.active || 0 },
    { name: "Completé", value: projectData.completed || 0 },
    { name: "Inactif", value: projectData.inactive || 0 },
  ];

  return (
    <div className="dashboard-admin-container">
      <div className="header">
        <div className="left">
          <h1 className="title">Dashboard</h1>
          <p className="text">Bienvenue dans votre espace de travail</p>
        </div>
        <div className="right">
          <i className="fa-solid fa-bell"></i>
          <span className="notification-badge">X</span>
        </div>
      </div>

      <div className="body">
        <div className="left">
          <h2
            className="mb-5 tache-journaliere"
            style={{ fontSize: "1.78rem" }}
          >
            Pourcentages des tâches journalières Completées
          </h2>
          <ResponsiveContainer width={"100%"} height={400} className="mt-5">
            <BarChart data={dailyTasksStats}>
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="pourcentage" fill="#34d399" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="right">
          {/* Tâches journalières */}
          <div style={{ width: "100%", maxWidth: "500px", margin: "auto" }}>
            <h3 style={{ textAlign: "center", fontSize: "1.7rem" }}>
              Tâches Longues
            </h3>
            {pieDataDaily.every((d) => d.value === 0) ? (
              <p style={{ color: "#888", textAlign: "center" }}>
                Aucune donnée à afficher pour les tâches longues.
              </p>
            ) : (
              <ResponsiveContainer width={"100%"} height={250}>
                <PieChart>
                  <Pie
                    data={pieDataDaily}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={98}
                    label
                  >
                    {pieDataDaily.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Projets */}
          <div style={{ width: "100%", maxWidth: "500px", margin: "auto" }}>
            <p style={{ textAlign: "center", fontSize: "1.7rem" }}>
              Avancement des Projets
            </p>
            {pieProject.every((d) => d.value === 0) ? (
              <p style={{ color: "#888", textAlign: "center" }}>
                Aucune donnée à afficher pour les projets.
              </p>
            ) : (
              <ResponsiveContainer width={"100%"} height={250}>
                <PieChart>
                  <Pie
                    data={pieProject}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={98}
                    label
                  >
                    {pieProject.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS2[index % COLORS2.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="footer">
        <div>
          <h3 className="recent-taches">
            <i class="fa-solid fa-clock-rotate-left"></i> Les Tâches Récentes :
          </h3>
          {stats.activities.recent.map((el) => (
            <Recent props={el} />
          ))}
        </div>
        <div>
          <h3 className="critical-taches ms-4">
            <i class="fa-solid fa-triangle-exclamation"></i> Les Tâches
            Critiques :
          </h3>
          {stats.activities.critical.map((el) => (
            <Critical props={el} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardAdminComp;
function Recent({ props }) {
  return (
    <div className="recent-dcontainer">
      <div className="tache-title">{props.title}</div>
      <div className="tache-description">{props.description}</div>
    </div>
  );
}
function Critical({ props }) {
  return (
    <div className="critical-dcontainer">
      <div className="tache-title">{props.title}</div>
      <div className="tache-description">{props.description}</div>
    </div>
  );
}

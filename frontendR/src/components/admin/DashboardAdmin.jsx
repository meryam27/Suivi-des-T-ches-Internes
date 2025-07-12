import React, { useEffect, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";
import axios from "axios";

const COLORS = ["#facc15", "#60a5fa", "#34d399", "#f87171"];

const DashboardAdminComp = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/admin/dashboard/stats", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => {
        console.error("Erreur récupération stats :", err);
      });
  }, []);
  console.log(stats.activities);
  if (!stats) return <div>Chargement des statistiques...</div>;

  const longTasksStats = stats.tasks.stats.find((s) => s.type === "long");

  const pieData = longTasksStats
    ? [
        { name: "À faire", value: longTasksStats.pending || 0 },
        { name: "En cours", value: longTasksStats.inProgress || 0 },
        { name: "Terminée", value: longTasksStats.completed || 0 },
        { name: "En retard", value: longTasksStats.late || 0 },
      ]
    : [];

  return (
    <div className="dashboard-admin-container">
      <div className="header">
        <div className="left">
          <h1 className="title">Dashboard</h1>
          <p className="text">Bienvenu dans votre espace de travail</p>
        </div>
        <div className="right">
          <i className="fa-solid fa-bell"></i>
          <span className="notification-badge">X</span>
        </div>
      </div>

      <div className="body">
        <div className="left">
          <div style={{ width: "100%", maxWidth: "500px", margin: "auto" }}>
            <h3 style={{ textAlign: "center" }}>
              Avancement des Tâches Longues
            </h3>
            {pieData.length === 0 ? (
              <p style={{ color: "#888", textAlign: "center" }}>
                Aucune donnée à afficher pour les tâches longues.
              </p>
            ) : (
              <ResponsiveContainer width={"100%"} height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={98}
                    label
                  >
                    {pieData.map((entry, index) => (
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
        </div>

        <div className="right">
          {/* Tu peux ajouter un autre graphique ou des KPIs ici */}
        </div>
      </div>

      <div className="footer"></div>
    </div>
  );
};

export default DashboardAdminComp;

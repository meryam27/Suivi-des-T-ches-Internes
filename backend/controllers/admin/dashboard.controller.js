const Project = require("../../models/project");
const Task = require("../../models/task");
const User = require("../../models/user");

exports.getStats = async (req, res) => {
  try {
    // 1. Statistiques globales (projets et tâches)
    const [
      activeProjects,
      inactiveProjects,
      completedProjects,
      totalTasks,
      tasksStats,
      recentActivities,
    ] = await Promise.all([
      Project.countDocuments({ status: "active" }),
      Project.countDocuments({ status: "inactive" }),
      Project.countDocuments({ status: "completed" }),
      Task.countDocuments(), // Total de toutes les tâches
      Task.aggregate([
        {
          $facet: {
            taskTypes: [
              {
                $group: {
                  _id: "$type",
                  total: { $sum: 1 },
                  completed: {
                    $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
                  },
                  inProgress: {
                    $sum: { $cond: [{ $eq: ["$status", "inProgress"] }, 1, 0] },
                  },
                  late: {
                    $sum: {
                      $cond: [
                        {
                          $and: [
                            { $ne: ["$status", "completed"] },
                            { $lt: ["$deadline", new Date()] },
                          ],
                        },
                        1,
                        0,
                      ],
                    },
                  },
                },
              },
            ],
            progressionStats: [
              {
                $group: {
                  _id: null,
                  avgProgression: { $avg: "$progress" },
                  minProgression: { $min: "$progress" },
                  maxProgression: { $max: "$progress" },
                },
              },
            ],
          },
        },
      ]),
      Task.find()
        .sort({ updatedAt: -1 })
        .limit(5)
        .populate("project", "name logo")
        .populate("assignedTo", "name profilePhoto"),
    ]);

    // ✅ Sécuriser l'accès à taskTypes et progressionStats
    const taskTypes = tasksStats[0]?.taskTypes || [];
    const progressionStats = tasksStats[0]?.progressionStats || [];

    // 2. Formatage des données
    const formattedTasksStats = taskTypes.map((type) => ({
      type: type._id,
      ...type,
    }));

    const progressionData = progressionStats[0] || {
      avgProgression: 0,
      minProgression: 0,
      maxProgression: 0,
    };

    // 3. Tâches critiques (en retard)
    const criticalTasks = await Task.find({
      deadline: { $lt: new Date() },
      status: { $ne: "completed" },
    })
      .sort({ deadline: 1 })
      .limit(5)
      .populate("project", "name priority")
      .populate("assignedTo", "name");

    // 4. Calcul de la progression globale
    const projects = await Project.find().select("progression");
    const overallProgression =
      projects.length > 0
        ? Math.round(
            projects.reduce((sum, p) => sum + p.progression, 0) /
              projects.length
          )
        : 0;

    // ✅ Envoi de la réponse JSON
    res.json({
      projects: {
        active: activeProjects,
        inactive: inactiveProjects,
        completed: completedProjects,
        total: activeProjects + inactiveProjects + completedProjects,
      },
      tasks: {
        stats: formattedTasksStats,
        progression: progressionData,
        total: totalTasks,
        overallProgression,
      },
      activities: {
        recent: recentActivities,
        critical: criticalTasks,
      },
    });
  } catch (err) {
    console.error("[Dashboard Controller] Error:", err);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des statistiques",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

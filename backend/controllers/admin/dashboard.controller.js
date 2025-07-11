const Project = require('../../models/project');
const Task = require('../../models/task');
const User = require('../../models/user');

exports.getStats = async (req, res) => {
  try {
    // 1. Statistiques projets
    const [activeProjects, inactiveProjects] = await Promise.all([
      Project.countDocuments({ status: 'active' }),
      Project.countDocuments({ status: 'inactive' })
    ]);

    // 2. Agrégation des tâches
    const tasksStats = await Task.aggregate([
      {
        $group: {
          _id: '$type',
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ['$status', 'inProgress'] }, 1, 0] }
          },
          late: {
            $sum: {
              $cond: [
                { 
                  $and: [
                    { $ne: ['$status', 'completed'] },
                    { $lt: ['$deadline', new Date()] }
                  ]
                }, 
                1, 
                0
              ]
            }
          }
        }
      }
    ]);

    // 3. Détails des tâches (complétées et en retard)
    const [completedTasks, lateTasks] = await Promise.all([
      Task.find({ status: 'completed' })
        .populate('project', 'name company')
        .populate('assignedTo', 'name position profilePhoto')
        .sort({ completionDate: -1 })
        .limit(5),
        
      Task.find({ 
        status: { $ne: 'completed' },
        deadline: { $lt: new Date() } 
      })
        .populate('project', 'name company')
        .populate('assignedTo', 'name position profilePhoto')
        .sort({ deadline: 1 })
        .limit(5)
    ]);

    res.json({
      projects: { active: activeProjects, inactive: inactiveProjects },
      tasks: tasksStats,
      completedTasks,
      lateTasks
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  company: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  startDate: { 
    type: Date, 
    default: Date.now 
  },
  endDate: Date,
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'completed'], 
    default: 'active' 
  },
  progression: {  // Nouveau champ
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  assignedEmployees: [{  // Assignation multiple
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  logo: {
    type: String, // URL ou chemin du fichier
    default: ''
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },//quand on transforme les documents en objectjs ou objectjson ca incluts les champs
  toObject: { virtuals: true }
});

// Virtual pour les tâches liées
ProjectSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'project'
});

// Middleware pour calcul automatique de la progression
ProjectSchema.pre('save', async function(next) {
  if (this.isModified('tasks')) {
    const tasks = await mongoose.model('Task').find({ project: this._id });
    if (tasks.length > 0) {
      const completedCount = tasks.filter(t => t.status === 'completed').length;
      this.progression = Math.round((completedCount / tasks.length) * 100);
    }
  }
  next();
});

module.exports = mongoose.model('Project', ProjectSchema);
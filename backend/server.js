const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const cors = require("cors");
const authMiddleware = require('./middlewares/auth.middleware');
const adminDashboardRoutes = require('./routes/admin/dashboard.routes');


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);//Toutes les routes définies dans authRoutes seront préfixées par /api/auth
app.use('/api/admin/dashboard', adminDashboardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur démarré sur le port ${PORT}`));

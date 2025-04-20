import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import vendorRoutes from './routes/vendorRoutes.js'
import formRoutes from './routes/formRoutes.js'
dotenv.config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb+srv://zuhairk7890o:Jhq7kruiceEMpoQT@cluster0.703rvj7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api", vendorRoutes);
app.use('/api/forms', formRoutes);
app.get("/", (req, res) => {
    res.send("🍽️ Kart Match API is running...");
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});

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
const allowedOrigins = [
    'https://kart-match.vercel.app',
    'http://localhost:3000'
  ];
  
  app.use(cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true // if you want to allow cookies and credentials
  }));
  
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

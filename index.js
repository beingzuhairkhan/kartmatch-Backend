import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";  
import { RateLimiterMemory } from "rate-limiter-flexible";  
import vendorRoutes from './routes/vendorRoutes.js';
import formRoutes from './routes/formRoutes.js';
import BengalVendor from './model/bengalSchema.js';
import MaharashtraVendor from './model/maharashtraSchema.js';
import RajasthanVendor from './model/rajasthanSchema.js';

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
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Apply helmet for security headers
app.use(helmet());

// Rate limiter setup
const rateLimiter = new RateLimiterMemory({
  points: 40, // Number of requests
  duration: 1, // Per second
});

// Rate-limiting middleware
app.use((req, res, next) => {
  rateLimiter.consume(req.ip) // Using IP address to limit requests
    .then(() => {
      next(); // If the limit is not reached, continue to the next middleware
    })
    .catch(() => {
      res.status(429).json({ message: 'Too many requests, please try again later.' });
    });
});

app.use(express.json());

// MongoDB connection
const mongoURI = "mongodb+srv://kartmatch:aC0cZJsIr2oLpOi2@cluster0.eax21iu.mongodb.net/kart-match?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    console.log("MongoDB connected");

    await BengalVendor.syncIndexes();
    console.log("BengalVendor indexes synchronized");

    await MaharashtraVendor.syncIndexes();
    console.log("MaharashtraVendor indexes synchronized");

    await RajasthanVendor.syncIndexes();
    console.log("RajasthanVendor indexes synchronized");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Routes
app.use("/api", vendorRoutes);
app.use('/api/forms', formRoutes);

app.get("/", (req, res) => {
  res.send("Kart Match API is running...");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// import csvtojson from 'csvtojson'
// import fs from 'fs';

// // Path to your CSV file
// const csvFilePath = 'k-new-maha.csv';

// csvtojson()
//   .fromFile(csvFilePath)
//   .then((jsonObj) => {
//     // Save or log the result
//     fs.writeFileSync('k-new-maha.json', JSON.stringify(jsonObj, null, 2));
//     console.log('CSV converted to JSON successfully!');
//   })
//   .catch((err) => {
//     console.error('Error while converting:', err);
//   });

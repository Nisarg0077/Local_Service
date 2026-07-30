require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

app.use(cors());
app.use(express.json());

// Serve static files from uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const connectDB = require("./config/db");
connectDB();

const bookingRoutes = require("./routes/BookingRoutes");
app.use("/api/bookings", bookingRoutes);

const providerRoutes = require("./routes/ProviderRoutes");
app.use("/api/providers", providerRoutes);

const serviceRoutes = require("./routes/ServiceRoutes");
app.use("/api/services", serviceRoutes);

// IMPORT ROUTES
const userRoutes = require("./routes/UserRoutes");
app.use("/api/userroutes", userRoutes);

// USE ROUTES
app.use("/api/users", userRoutes);

const categoryRoutes = require("./routes/categoriesRouts");
app.use("/api/categories", categoryRoutes);

const notificationRoutes = require("./routes/NotificationRoutes");
app.use("/api/notification", notificationRoutes);


const reviewRoutes = require("./routes/ReviewRoutes");
app.use("/api/reviews", reviewRoutes);

//MIGRATION APIs

const migration = require("./migration/migration");
app.get("/api/migration/:collectionName", async (req, res) => {
  let { collectionName } = req.params;

  collectionName =
    collectionName.charAt(0).toUpperCase() + collectionName.slice(1);

  try {
    const result = await migration(collectionName);

    res.json({
      success: true,
      collection: collectionName,
      ...result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// TEST ROUTE
app.get("/", (req, res) => {
    res.send("API running");
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});
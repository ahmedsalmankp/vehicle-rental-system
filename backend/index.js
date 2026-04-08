const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/rental")
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// Models
const User = require("./models/User");
const Vehicle = require("./models/Vehicle");
// Insert dummy vehicles (run once)
const insertVehicles = async () => {
    const count = await Vehicle.countDocuments();

    if (count === 0) {
        await Vehicle.insertMany([
            { name: "Honda City", price: 2000 },
            { name: "Swift", price: 1500 },
            { name: "Creta", price: 2500 }
        ]);

        console.log("Dummy vehicles added");
    }
};

insertVehicles();
const Booking = require("./models/Booking");

// Fraud logic
function fraudScore(user) {
    let score = 0;
    if (user.bookings > 5) score += 30;
    if (user.failedPayments > 2) score += 50;
    return score;
}

// Register API
app.post("/register", async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const user = await User.create({
            email: req.body.email,
            password: req.body.password,
            bookings: 0,
            failedPayments: 0
        });

        user.fraudScore = fraudScore(user);
        await user.save();

        res.json({ success: true, message: "Registration successful" });
    } catch (err) {
        res.status(500).json({ error: "Server error during registration" });
    }
});

// Login API
app.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (user.password !== req.body.password) {
            return res.status(401).json({ error: "Invalid password" });
        }

        user.fraudScore = fraudScore(user);
        await user.save();

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: "Server error during login" });
    }
});

// Get vehicles
app.get("/vehicles", async (req, res) => {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
});

// Book vehicle
app.post("/book", async (req, res) => {
    await Booking.create({
        userId: "1",
        vehicleId: req.body.vehicleId
    });

    res.send("Booked");
});

// Start server
app.listen(5000, () => console.log("Server running on port 5000"));
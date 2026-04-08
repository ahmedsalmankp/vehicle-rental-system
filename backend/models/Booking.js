const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    userId: String,
    vehicleId: String
});

module.exports = mongoose.model("Booking", bookingSchema);
const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
    name: String,
    price: Number
});

module.exports = mongoose.model("Vehicle", vehicleSchema);
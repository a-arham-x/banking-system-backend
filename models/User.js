const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    email: {type: String},
    currentBalance: {type: Number, default: 0}
})

module.exports = mongoose.model("users", userSchema);
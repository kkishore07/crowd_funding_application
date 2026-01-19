const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "creator", "admin"], default: "user" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);

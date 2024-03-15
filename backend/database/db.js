const mongoose = require("mongoose");
require("dotenv").config();

// database connection
mongoose.connect(process.env.MONGOOSE_URL);

// user schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 3,
    maxLength: 30,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
});

//account schema
const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // reference to user
    ref: "User",
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
});

// models
const User = mongoose.model("User", userSchema);
const Account = mongoose.model("Account", accountSchema);

// user export
module.exports = { User, Account };

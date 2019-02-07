"use strict";

const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;
const Bcrypt = require("bcrypt");
const Boom = require("boom");
const When = require("when");
const MD5 = require("md5");
const Crypto = require("crypto");
const Validator = require("validator");

const SALT_WORK_FACTOR = 12;

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    trim: true,
    required: true,
    validate: {
      isAsync: true,
      validator: Validator.isEmail,
      message: "Invalid email address"
    }
  },
  password: {
    type: String,
    required: true
  },
  passwordResetToken: {
    type: String,
    unique: true,
    trim: true
  },
  passwordResetDeadline: Date
});

// Static method for finding email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email });
};

// Instance method for hashing password
userSchema.methods.hashPassword = async function() {
  const salt = await Bcrypt.genSalt(SALT_WORK_FACTOR);
  const hash = await Bcrypt.hash(this.password, salt);

  this.password = hash;
  return this;
};

//  Instance method for comparing passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  const isMatch = await Bcrypt.compare(candidatePassword, this.password);

  if (isMatch) {
    return this;
  }

  const message = "The entered password is incorrect";
  throw new Boom(message, {
    statusCode: 400,
    data: { password: { message } }
  });
};

//  Instance method for resetting password
userSchema.methods.resetPassword = async function() {
  try {
    const passwordResetToken = Crypto.randomBytes(20).toString("hex");

    const salt = await Bcrypt.genSalt(SALT_WORK_FACTOR);
    const hash = await Bcrypt.hash(passwordResetToken, salt);

    this.passwordResetToken = hash;
    this.passwordResetDeadline = Date.now() + 1000 * 60 * 60; // 1 hour from now

    await this.save();

    return passwordResetToken;
  } catch (ignoreError) {
    const message =
      "An error occurred while hashing your password reset token.";

    throw new Boom(message, {
      statusCode: 400,
      data: { password: { message } }
    });
  }
};

//  Instance method for comparing reset token
userSchema.methods.comparePasswordResetToken = async function(resetToken) {
  const isMatch = await Bcrypt.compare(resetToken, this.passwordResetToken);

  if (isMatch) {
    return this;
  }

  const message =
    "Your password reset token is invalid, please request a new one.";

  throw new Boom(message, {
    statusCode: 400,
    data: { password: { message } }
  });
};
userSchema.methods.comparePasswordResetToken = async function(resetToken) {
  const isMatch = await Bcrypt.compare(resetToken, this.passwordResetToken);

  if (isMatch) {
    return this;
  }

  const message =
    "Your password reset token is invalid, please request a new one.";

  throw new Boom(message, {
    statusCode: 400,
    data: { password: { message } }
  });
};

module.exports = Mongoose.model("User", userSchema);

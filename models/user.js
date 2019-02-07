"use strict";

const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;
const Bcrypt = require("bcrypt");
const Boom = require("boom");
const When = require("when");
const MD5 = require("md5");
const Crypto = require("crypto");
const Validator = require("validator");
const _ = require('lodash')  
const Haikunator = require('haikunator');


const SALT_WORK_FACTOR = 12;

// initialize haikunator to generate funky usernames
// initialize to not append numbers to generated names
// e.g. "proud-mode" instead of "proud-mode-4711"
const haikunator = new Haikunator({  
	defaults: { tokenLength: 0 }
  })
  

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
  passwordResetDeadline: Date,

  username: {
    type: String,
    unique: true,
    trim: true,
    sparse: true // this makes sure the unique index applies to not null values only (= unique if not null)
  },
  homepage: {
    type: String,
    trim: true
  }

});


/**
 * pre-save hook to generate a unique username
 */
userSchema.pre('save', async function(next) {  
	if (this.isNew) {
	  // split email address at @ symbol and only return the first part
	  this.username = _.first(_.split(this.email, '@', 1))
  
	  // find existing user with the same username
	  const existingUser = await this.constructor.findOne({ username: this.username })
  
	  // TODO this can lead to duplicated keys if haikunate generates the same slug twice
	  if (existingUser) {
		this.username = `${this.username}-${haikunator.haikunate()}`
	  }
	}
  
	// tell mongoose to proceed
	next()
  })

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

//  Gravatar image for user
userSchema.virtual('gravatar').get(function () {  
	// create the MD5 hash from the user’s email address
	const hash = MD5(this.email)
	// return the ready-to-load avatar URL
	return `https://gravatar.com/avatar/${hash}?s=100`
  })

module.exports = Mongoose.model("User", userSchema);

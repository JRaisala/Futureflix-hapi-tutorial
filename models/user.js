'use strict'

const Mongoose = require('mongoose')  
const Schema = Mongoose.Schema
const Bcrypt = require('bcrypt')
const Boom = require('boom')  
const When = require('when')


const SALT_WORK_FACTOR = 12

const userSchema = new Schema({  
  email: {
    type: String,
    unique: true,
    trim: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

/**
 * Model Methods (Statics)
 */
userSchema.statics.findByEmail = function (email) {  
	return this.findOne({ email })
  }

/**
 * Instance Methods
 */
userSchema.methods.hashPassword = async function () {  
	const salt = await Bcrypt.genSalt(SALT_WORK_FACTOR)
	const hash = await Bcrypt.hash(this.password, salt)
  
	this.password = hash
	return this
  }

// this is the new method
userSchema.methods.comparePassword = async function (candidatePassword) {  
	const isMatch = await Bcrypt.compare(candidatePassword, this.password)
  
	if (isMatch) {
	  return this
	}
  
	const message = 'The entered password is incorrect'
	throw new Boom(message, {
	  statusCode: 400,
	  data: { password: { message } }
	})
  }

module.exports = Mongoose.model('User', userSchema)  
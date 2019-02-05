'use strict'

const Mongoose = require('mongoose')
const User = require('./user')
const Movie = require('./movie')
const Show = require('./show')
const Season = require('./season')
const Episode = require('./episode')

// tell Mongoose to use Node.js promises
Mongoose.Promise = global.Promise

// Connect to your database
Mongoose.connect(process.env.DATABASE, 
{   useCreateIndex: true,
	useNewUrlParser: true,
	useFindAndModify: false
})

// listen for connection errors and print the message
Mongoose.connection.on('error', err => {
  console.error(`⚡️ 🚨 ⚡️ 🚨 ⚡️ 🚨 ⚡️ 🚨 ⚡️ 🚨  → ${err.message}`)
  throw err
})

// listen for successful connection
Mongoose.connection.on('connected', () => {  
	console.log(`✅  connected to Mongo`)
  })

// use ES6 shorthands: "propertyName: variableName" equals "propertyName"
module.exports = {
  User,
  Movie,
  Show,
  Season,
  Episode
}

'use strict'

const Mongoose = require('mongoose')
const Movie = require('./movie')
const Show = require('./show')
const Season = require('./season')
const Episode = require('./episode')

// tell Mongoose to use Node.js promises
Mongoose.Promise = global.Promise

// Connect to your database
Mongoose.connect(process.env.DATABASE || 'mongodb://homer:password1@ds139341.mlab.com:39341/hapi-tutorial-auth-server-db', 
{   useCreateIndex: true,
	useNewUrlParser: true,
	useFindAndModify: false
})

// listen for connection errors and print the message
Mongoose.connection.on('error', err => {
  console.error(`⚡️ 🚨 ⚡️ 🚨 ⚡️ 🚨 ⚡️ 🚨 ⚡️ 🚨  → ${err.message}`)
  throw err
})

// use ES6 shorthands: "propertyName: variableName" equals "propertyName"
module.exports = {
  Movie,
  Show,
  Season,
  Episode
}

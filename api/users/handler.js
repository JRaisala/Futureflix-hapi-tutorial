'use strict'

const JWT = require('jsonwebtoken')

const Handler = {  
	login: {
	  auth: 'basic',
	  handler: (request, h) => {
		const token = JWT.sign(request.user.toObject(), process.env.JWT_SECRET_KEY, {
		  algorithm: 'HS256',
		  expiresIn: '14d'
		})
  
		return { authToken: token }
	  }
	}
  }
  
  module.exports = Handler
"use strict";

const Joi = require("joi");
const When = require("when");
const Boom = require("boom");
const User = require("../../models").User;
const Mailer = require("../../utils/mailer");
const ErrorExtractor = require("../../utils/error-extractor");

const Handler = {
  showSignup: {
    handler: (request, h) => {
      return h.view("signup");
    }
  },
  signup: {
	handler: async (request, h) => {

		if (request.auth.isAuthenticated) {
		  return h.redirect('/profile')
		}
    
		// shortcut
		const payload = request.payload
 
		try {
			// check whether the email address is already registered
			let user = await User.findByEmail(payload.email)
  
		  if (user) {
			// create an error object that matches our error structure
			const message = 'Email address is already registered'
			throw new Boom(message, {
			  statusCode: 409,
			  data: { email: { message } }
			})
		  }
 
		  // create a new user
		  const newUser = new User({
			email: payload.email,
			password: payload.password,
			scope: ['user']
		  })
  			
		  // don’t store the plain password in your DB, hash it!
			user = await newUser.hashPassword()
			user = await user.save()

	
			request.cookieAuth.set({ id: user.id })  // <--- this is the important line


			const discoverURL = `http://${request.headers.host}/discover`
			Mailer.send('welcome', user, 'Futureflix — Great to see you!', { discoverURL })
		  	
	
			// \o/ wohoo, sign up successful
			return h.view('signup-success')
		}  
		catch (err) {
		  const status = err.isBoom ? err.output.statusCode : 400
  
		  return h
			.view('signup', {
			  email: payload.email,
			  errors: err.data
			})
			.code(status)
		}  
	  },
	  validate: {
		options: {
		  stripUnknown: true,
		  abortEarly: false
		},
		payload: {
		  email: Joi.string()
			.email({ minDomainAtoms: 2 })
			.required()
			.label('Email address'),
		  password: Joi.string()
			.min(6)
			.required()
			.label('Password')
		},
		failAction: (request, h, error) => {
		  // prepare formatted error object
		 const errors = ErrorExtractor(error)
		  // remember the user’s email address and pre-fill for comfort reasons
		  const email = request.payload.email
  
		  return h
			.view('signup', {
			  email,
			  errors
			})
			.code(400)
			.takeover()
		}
	  }
	},
	showLogin: {
		handler: (request, h) => {
		return h.view('login')
		}
	},
	login: {
		handler: async (request, h) => {  
			if (request.auth.isAuthenticated) {
			  return h.redirect('/profile')
			}
		  
			// shortcut
			const payload = request.payload
		  
			try {
			  let user = await User.findByEmail(payload.email)
		  
			  if (!user) {
				const message = 'Email address is not registered'
				throw new Boom(message, {
				  statusCode: 404,
				  data: { email: { message } }
				})
			  }

			  await user.comparePassword(payload.password)
			  request.cookieAuth.set({ id: user.id })
			 
		  
			  return h.redirect('/profile')
			} catch (err) {
			  const status = err.isBoom ? err.output.statusCode : 400
		  
			  return h
				.view('login', {
				  email: payload.email,
				  errors: err.data
				})
				.code(status)
			}
		  },
			validate: {  
				options: {
				  stripUnknown: true,
				  abortEarly: false
				},
				payload: {
				  email: Joi.string()
					.email({ minDomainAtoms: 2 })
					.required()
					.label('Email address'),
				  password: Joi.string()
					.min(6)
					.required()
					.label('Password')
				},
				failAction: async (request, h, error) => {
				  // prepare formatted error object
				  const errors = ErrorExtractor(error)
				  // remember the user’s email address and pre-fill for comfort reasons
				  const email = request.payload.email
			  
				  return h
					.view('login', {
					  email,
					  errors
					})
					.code(400)
					.takeover()
				}
			  }
		  },
		  logout: {  
			auth: 'session',
			handler: (request, h) => {
			  request.cookieAuth.clear()
			  return h.redirect('/')
			}
		  }
		  
	}

module.exports = Handler;

'use strict'

const Boom = require('boom')  
const { User } = require('../../models')

async function register(server, options) {  
  await server.register([
    {
      plugin: require('hapi-auth-basic')
	},
	{
	  plugin: require('hapi-auth-jwt2')
	},
    {
      plugin: require('hapi-request-user')
    }
  ])

  /**
   * Basic authentication strategy for username and password
   */
  server.auth.strategy('basic', 'basic', {
    validate: async (request, email, password) => {
      const user = await User.findByEmail(email)

      if (!user) {
        throw Boom.notFound('There is no user with the given email address')
      }

      // this throws if passwords do not match
      await user.comparePassword(password)

      return { credentials: user, isValid: true }
    }
  })

	server.auth.strategy('jwt', 'jwt', {
    key: [process.env.JWT_SECRET_KEY],
    tokenType: 'Bearer',
    verifyOptions: {
      algorithms: ['HS256']
    },
    validate: (user, request, h) => {
      if (user) {
        return { isValid: true, credentials: user }
      }

      return { isValid: false }
    },
    errorFunc: ({ message }) => {
      throw Boom.unauthorized(message || 'Invalid or expired JWT')
    }
  })
    // --> this is the important line
	server.auth.default('jwt')
}

exports.plugin = {  
  name: 'api-authentication',
  version: '1.0.0',
  register,
  once: true
}
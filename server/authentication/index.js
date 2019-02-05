'use strict'

const Routes = require('./routes')



exports.plugin = {
	name: "cookie",
	version: "1.0.0",
	register: async server => {

  // declare dependencies to hapi-auth-* plugins
   server.route(Routes)

	// register hapi-auth-* plugins here
	await server.register([{
	plugin: require('hapi-auth-cookie')
	}
	])
	
  /**
   * Register cookie-based session auth to remember
   * the logged in user
   */
		server.auth.strategy("session", "cookie", {
		password: "password-should-be-32-characters",
		cookie: "session",
		isSecure: false,
		redirectTo: "/login"
		})
	}
}
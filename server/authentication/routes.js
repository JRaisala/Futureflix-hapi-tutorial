var Boom = require('boom')
var Bcrypt = require('bcrypt')

var routes = [
  {
    method: 'GET',
    path: '/login',
    config: {
	handler: function (request, h) { 
		return h.view(
			'login',
			{ layout: 'layout' }
		  )}
	}
  },
  /*
  {
    method: 'POST',
    path: '/login',
    config: {
      auth: {
        mode: 'try'
      },
      plugins: {
        'hapi-auth-cookie': {
          redirectTo: false
        }
      },
      handler: function (request, reply) {
        if (request.auth.isAuthenticated) {
          return reply.view('Profile')
        }

        var username = request.payload.username
        var user = Users[ username ]

        if (!user) {
          return reply(Boom.notFound('No user registered with given credentials'))
        }

        var password = request.payload.password

        return Bcrypt.compare(password, user.password, function (err, isValid) {
          if (isValid) {
            request.server.log('info', 'user authentication successful')
            request.cookieAuth.set(user);
            return reply.view('profile')
          }

          return reply.view('index')
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/logout',
    config: {
      auth: 'session',
      handler: function (request, reply) {
        request.cookieAuth.clear();
        reply.view('index')
      }
    }
  }*/
]

module.exports = routes
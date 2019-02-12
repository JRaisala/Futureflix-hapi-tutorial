'use strict'

function isHapiValidationError (error) {}

function register (server, options) {  
  server.ext('onPreResponse', (request, h) => {
    const error = request.response

    if (!isHapiValidationError(error)) {
      // no ValidationError, continue request lifecycle
      return h.continue
    }

    const data = error.details[0]

    const payload = {
      statusCode: 400,
      error: 'Bad Request',
      message: data.message
    }

    return h.response(payload).code(payload.statusCode)
  })
}

exports.plugin = {  
  name: 'hapi-validation-error-interceptor',
  register
}
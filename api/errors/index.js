
const APIValidationError   = require('./api-validation-error')

async function register (server, options) {  
await server.register([
	APIValidationError 
])
	

server.log('info', 'API Plugin registered: error interceptors (for API and Validation errors)')
}

module.exports = {
	APIValidationError
  }
  
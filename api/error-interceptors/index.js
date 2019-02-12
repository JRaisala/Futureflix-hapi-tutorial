const ValidationErrorInterceptor = require('./validation-error')

async function register (server, options) {  
await server.register([
	ValidationErrorInterceptor
])
	

server.log('info', 'API Plugin registered: error interceptors (for API and Validation errors)')
}

exports.plugin = {  
name: 'api-error-interceptors',
version: '1.0.0',
register
}
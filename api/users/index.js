'use strict'

const Routes = require('./routes')

async function register(server, options) {  
  await server.register({
    plugin: require('./../authentication')
  })

  server.route(Routes)
  server.log('info', 'Plugin registered: API users')
}

exports.plugin = {  
  name: 'api-users',
  version: '1.0.0',
  register
}
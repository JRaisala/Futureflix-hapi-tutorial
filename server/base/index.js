'use strict'

const Routes = require('./routes')

function register (server, options) {
  server.dependency(['vision'])

  server.route(Routes)
  server.log('info', 'Plugin registered: base routes & assets')
}

exports.plugin = {
  name: 'base-routes-assets',
  version: '1.0.0',
  register
}

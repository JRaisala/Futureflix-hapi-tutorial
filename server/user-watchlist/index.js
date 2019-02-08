'use strict'

const Routes = require('./routes')

function register (server, options) {  
  server.dependency(['vision'])

  server.route(Routes)
  server.log('info', 'Plugin registered: user watchlist')
}

exports.plugin = {  
  name: 'user-watchlist',
  version: '1.0.0',
  register
}
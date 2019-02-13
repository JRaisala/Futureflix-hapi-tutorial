'use strict'

const Handler = require('./handler')

const Routes = [  
  {
    method: 'POST',
    path: '/login',
    config: Handler.login
  }
]

module.exports = Routes
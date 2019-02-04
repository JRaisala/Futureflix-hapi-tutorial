'use strict'

const Handler = require('./handler')

const Routes = [  
  {
    method: 'GET',
    path: '/signup',
    config: Handler.showSignup
  },
  {
    method: 'POST',
    path: '/signup',
    config: Handler.signup
  }
]

module.exports = Routes  
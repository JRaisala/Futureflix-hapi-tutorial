'use strict'

const User = require('../../models').User  

const Handler = {  
	showSignup: {
	  handler: (request, h) => {
		return h.view('signup')
	  }
	},
  
	signup: {
    handler: (request, h) => {
      // implement the actual sign up processing
    }
  }
}

module.exports = Handler  
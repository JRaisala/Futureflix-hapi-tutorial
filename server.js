'use strict'

const Hapi = require('hapi')
const Path = require('path')
const Dotenv = require('dotenv')
const Handlebars = require('handlebars')
const HandlebarsRepeatHelper = require('handlebars-helper-repeat')

// extend handlebars instance
Handlebars.registerHelper('repeat', HandlebarsRepeatHelper)

// import environment variables from local secrets.env file
Dotenv.config({ path: Path.resolve(__dirname, 'secrets.env') })

// create new server instance and connection information
const webServer = new Hapi.Server({
  host: 'localhost',
  port: process.env.PORT || 3000
})

// register plugins, configure views and start the server instance
async function startWeb () {
  // register plugins to server instance
  await webServer.register([
    {
      plugin: require('inert')
    },
    {
      plugin: require('vision')
	},
    {
      plugin: require('./server/authentication')
	},
	{
		plugin: require('./server/add-user-to-request')
	},
    {
      plugin: require('./server/base')
    },
    {
      plugin: require('./server/movies')
    },
    {
      plugin: require('./server/tv-shows')
    },
    {
      plugin: require('./server/user-profile')
    },
    {
      plugin: require('./server/add-user-to-views')
	},
	{
	  plugin: require('./server/user-signup-login')
	},
	{
		plugin: require('./server/user-watchlist')
	  },
	  {
		plugin:  require('crumb'),
		options: {
		key: 'keepMeSafeFromCsrf',
		cookieOptions: {
		isSecure: process.env.NODE_ENV === 'production'
		}
	}
  }
  ])

  // view configuration
  const viewsPath = Path.resolve(__dirname, 'public', 'views')

  webServer.views({
    engines: {
      hbs: Handlebars
    },
    path: viewsPath,
    layoutPath: Path.resolve(viewsPath, 'layouts'),
    layout: 'layout',
    helpersPath: Path.resolve(viewsPath, 'helpers'),
    partialsPath: Path.resolve(viewsPath, 'partials'),
    isCached: process.env.NODE_ENV === 'production',
    context: {
      title: 'Futureflix'
    }
  })

  // start your server
  try {
    await webServer.start()
    console.log(`webServer started → ${webServer.info.uri}`)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}



// API SERVER
const api = new Hapi.Server({  
	host: 'localhost',
	port: process.env.PORT_API || 3001
  })
  
  // register plugins and start the API web instance
  async function startApi () {  
	// register plugins to web instance
	await api.register([
	  {
		plugin: require('hapi-dev-errors'),
		options: {
		  showErrors: process.env.NODE_ENV !== 'production',
		  useYouch: true
		}
	  },
	  {
		plugin: require('laabr'),
		options: {
		  colored: true,
		  hapiPino: {
			logPayload: false
		  }
		}
	  },
	  {
		plugin: require('./api/tv-shows')
	  }
	
	])
  
	// start the API
	try {
	  await api.start()
	  console.log(`ApiServer started → ${webServer.info.uri}`)
	} catch (err) {
	  console.error(err)
	  process.exit(1)
	}
  }
  
  startWeb()  
  startApi()  
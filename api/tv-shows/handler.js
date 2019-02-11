'use strict'

const Boom = require('boom')  
const Joi = require('joi')  
const Path = require('path')  
const Show = require(Path.resolve(__dirname, '..', '..', 'models')).Show
const Paginator = require(Path.resolve(__dirname, '..', '..', 'utils', 'paginator'))

const Handler = {  
  index: {
    handler: async (request, h) => {
		const totalCount = await Show.count()
		const pagination = new Paginator(request, totalCount)
  
		if (pagination.currentPage > pagination.lastPage) {
		  return Boom.notFound(
			`The requested page does not exist. The last available page is: ${pagination.lastPage}`
		  )
		}
  
		const shows = await Show.find()
		  .skip(pagination.from)
		  .limit(pagination.perPage)
  
		return h.response(shows).header('Link', pagination.link)
	  },
	  validate: {
		query: {
		  page: Joi.number().integer().min(1)
		}
	  }
	},

  show: {
    handler: async (request, h) => {
      const slug = request.params.slug
      const show = await Show.findOne({ 'ids.slug': slug })

      if (!show) {
        return Boom.notFound('Cannot find a show with that slug')
      }

      return show
    },
    validate: {
      params: {
        slug: Joi.string().required()
      }
    }
  }
}

module.exports = Handler  
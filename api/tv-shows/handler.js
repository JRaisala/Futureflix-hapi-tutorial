'use strict'

const Boom = require('boom')  
const Joi = require('joi')  
const Path = require('path')  
const Show = require(Path.resolve(__dirname, '..', '..', 'models')).Show
const Paginator = require(Path.resolve(__dirname, '..', '..', 'utils', 'paginator'))
const APIValidationError = require(Path.resolve(__dirname, '..', 'errors')).APIValidationError  

function getPopulationOptions (extend = '') {  
	if (hasSeasonsAndEpisodes(extend)) {
	  return { path: 'seasons', populate: { path: 'episodes' } }
	}
  
	if (hasSeasonsOnly(extend)) {
	  return { path: 'seasons' }
	}
  
	return ''
  }
  

function hasSeasonsOnly (extend) {  
	return extend.includes('seasons') && !extend.includes('episodes')
  }  

function hasSeasonsAndEpisodes (extend) {  
	return extend.includes('seasons') && extend.includes('episodes')
  }


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
		
  
		const options = getPopulationOptions(request.query.extend)
  
		const shows = await Show.find()
		  .populate(options)
		  .skip(pagination.from)
		  .limit(pagination.perPage)
  
		 return h.response(shows).header('Link', pagination.link)
		return shows
	  },
	  validate: {
		query: {
		  page: Joi.number().integer().min(1),
		  extend: Joi.string()
			.valid(['seasons', 'seasons,episodes'])
			.description('Extend the result by seasons or seasons and episodes.')
			.error(
				new APIValidationError(
					'The extend query parameter value must be one of ["seasons", "seasons,episodes"]',
					'/docs#!/TV_shows/getShows'
				  )
			)
		}
	  }
	},
  
	show: {
	  handler: async (request, h) => {
		const slug = request.params.slug
		const options = getPopulationOptions(request.query.extend)
		const show = await Show.findOne({ 'ids.slug': slug }).populate(options)
  
		if (!show) {
		  return Boom.notFound('Cannot find a show with that slug')
		}
  
		return show
	  }
  }
}

module.exports = Handler  
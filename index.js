'use strict'

var jwtKeygrip = require('jwt-keygrip')

module.exports = function MservAuthJWTPlugin(service, options) {

	let jwt = jwtKeygrip(options.keys, options.algorithm)

	return function*(data) {
		return jwt.decode(new Buffer(data,'base64'))
	}
}

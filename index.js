'use strict'

var jwtKeygrip = require('jwt-keygrip')

module.exports = function MservAuthJWTPlugin(service, options) {

	let jwt = jwtKeygrip(options.keys, options.algorithm)

	function jwtEncodeExtension() {
		return jwt.encode.bind(jwt)
	}

	function jwtDecodeExtension() {
		return jwt.decode.bind(jwt)
	}

	service.extend('jwtEncode', jwtEncodeExtension)
	service.extend('jwtDecode', jwtDecodeExtension)

	return function*(data) {
		return jwt.decode(data)
	}
}

# Introduction
mserv-auth-jwt is a plugin for [mserv-auth](https://github.com/macprog-guy/mserv-auth) itself middleware for [mserv](https://github.com/macprog-guy/mserv). It adds JWT authentication to the middleware.


# Installation

	$ npm i --save mserv-auth-jwt

# Usage

```js

var mserv   = require('mserv'),
	auth    = require('mserv-auth'),
	helpers = require('mserv-auth/helpers'),
	jwtauth = require('mserv-auth-jwt'),

var service = mserv().use('auth', auth)
	
service.ext.auth('bearer', jwtauth, {
	keys: ['1234567890987654321', '1019181716151413120'],
	algorithm:'HS512'
})

service.invoke('some-action', args, helpers.authorization('Bearer', jwt))

```







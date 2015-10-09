'use strict'

var chai    = require('chai'),
	should  = chai.should(),
    mserv   = require('mserv'),
	auth    = require('mserv-auth'),
	helpers = require('mserv-auth/helpers'),
	authJWT = require('.'),
	jwtGood = require('jwt-keygrip')(['good-key','also-a-good-key']),
	jwtBad  = require('jwt-keygrip')(['some-other-key']),
	co      = require('co')

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

function wrappedTest(generatorFunc) {
	return function(done) {
		try {
			co(generatorFunc)
			.then(
				function()   { done()    },
				function(err){ done(err) }
			)
		}
		catch(err) {
			done(err)
		}
	}
}




describe("mserv-auth-jwt", function(){

	let service = mserv({amqp:false}).use('auth',auth)

	service.action({
		name: 'private',
		auth: 'root',
		handler: function*(){
			return 'ok'
		}
	})

	service.ext.auth('bearer',authJWT,{
		keys: jwtGood.keys
	})

	it('should execute the action and return ok', wrappedTest(function*(){
		
		let token = jwtGood.encode({scope:'root'}),
			result = yield service.invoke('private',null, {authorization:'Bearer '+token})

		result.should.eql('ok')
	}))

	it('should not execute and return unauthorized', wrappedTest(function*(){
		
		try {		
			let token  = jwtBad.encode({scope:'root'}),
				result = yield service.invoke('private',null, {authorization:'Bearer undefined'})
			throw new Error('Invoke did not throw')
		}
		catch(err) {
			if (err.message === 'Invoke did not throw')
				throw err

			err.message.should.equal('Unauthorized')
		}		
	}))



	it('should not execute the action and return unauthorized', wrappedTest(function*(){

		try {		
			let token  = jwtBad.encode({scope:'root'}),
				result = yield service.invoke('private',null, {authorization:'Bearer '+token})
			throw new Error('Invoke did not throw')
		}
		catch(err) {
			if (err.message === 'Invoke did not throw')
				throw err

			err.message.should.equal('Unauthorized')
		}		
	}))

	it('should encode the token', wrappedTest(function*(){

		let token1 = jwtGood.encode({scope:'root'}),
			token2 = service.ext.jwtEncode({scope:'root'})

		token2.should.equal(token1)
	}))

	it('should decode the token', wrappedTest(function*(){

		let token1 = service.ext.jwtEncode({scope:'root'}),
			creds  = service.ext.jwtDecode(token1)

		creds.should.eql({scope:'root'})
	}))
})




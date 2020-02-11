// Plugin code goes here
var znHttp = require('./lib/zn-http');
const _ = require('lodash');
const Promise = require('bluebird');
const request = Promise.promisify(require('request-promise'));
const fs = Promise.promisifyAll(require('fs'));
const path    = require('path');
const Axios = require('axios');


exports.run = function(eventData) {

	if (eventData.request.method === 'POST') {

		const formId = eventData.request.body.formID;
		const workspaceID = eventData.request.body.workspaceID;
		console.log('formId: ', formId);

		znHttp().get(`/forms/${formId}`).then(function(response) {
			console.log('response ', response);
			console.log('test');

			// return first form
			eventData.response.status(200).send(response.getBody());

		}).catch((err)=>console.error(err))
		// , function(error) {

		// 	eventData.response.status(404).send(error.getBody());
		// });
		
	} else {
		eventData.response.status(404).send('Not found');
	}

}

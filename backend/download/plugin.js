// Plugin code goes here
var znHttp = require('./lib/zn-http');

exports.run = function(eventData) {

	if (eventData.request.method === 'POST') {

		var formId = eventData.request.query.id;
		console.log(formId);

		// znHttp().get('/forms/' + formId).then(function(response) {

		// 	// return first form
		// 	eventData.response.status(200).send(response.getBody());

		// }, function(error) {

		// 	eventData.response.status(404).send(error.getBody());
		// });
		
	} else {
		eventData.response.status(404).send('Not found');
	}

}

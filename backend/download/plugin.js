// Plugin code goes here
var znHttp = require('./lib/zn-http');
const _ = require('lodash');
const Promise = require('bluebird');


/*
exports.run = function(eventData) {
*/
exports.run = async function(eventData) {
	if (eventData.request.method === 'POST') {
		const formId = eventData.request.body.formID;
		const workspaceID = eventData.request.body.workspaceID;

		let urls = await downloadAll(formId);
		if(urls){
			eventData.response.status(200).send(urls);
		}	
	} else {
		eventData.response.status(404).send('Not found');
	}

}

async function downloadAll(workspaceId){
	const count = await getTotalCount(workspaceId)
	const pages = await Math.ceil(count/100)+1;
	const links = await getUrls(workspaceId, pages);

	return links

}

async function getTotalCount(workspaceId){
	let count;
	 count = await znHttp().get(`/files.json?workspace.id=${workspaceId}&limit=1`).then(function(response) {
		let formList = response.body;
		let fields = (JSON.parse(formList));
		count= fields.totalCount
		return count;
	}).catch(err => console.error(err))

	return count;
}

async function getUrls(workspaceId, pages){
	let currentPage = 1;
	const urls = []
	while(currentPage < pages){
		await znHttp().get(`/files.json?workspace.id=${workspaceId}&limit=100&page=${currentPage}`).then(function(response) {
			let formList = response.body;
			let fields = (JSON.parse(formList));
			fields.data.map((element)=>{
				urls.push({'url': element.downloadUrl, 'name': element.name +'.'+ element.extension});
			 })
		}).catch(err => console.error(err))
		currentPage++;
	}
	if(currentPage>=pages){
		return urls
	}
}

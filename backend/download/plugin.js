// Plugin code goes here
var znHttp = require('./lib/zn-http');
const _ = require('lodash');
const Promise = require('bluebird');
const request = Promise.promisify(require('request-promise'));
const fs = Promise.promisifyAll(require('fs'));
const path    = require('path');
const Axios = require('axios');
const JSZip = require('jszip');
const JSZipUtils = require('jszip-utils')
var zip = new JSZip();


exports.run = async function(eventData) {

	if (eventData.request.method === 'POST') {

		const formId = eventData.request.body.formID;
		const workspaceID = eventData.request.body.workspaceID;

		let urls = await downloadAll(formId);
		if(urls){
			console.log(urls)
			eventData.response.status(200).send(urls);
		}

		
			// znHttp().get('/forms/' + formId).then(function(response) { 
			// 	let formList = response.body;
			// 	let fields = (JSON.parse(formList).data.fields);
			// 	let uploads = fields.filter(field => {
			// 		if(field.type === 'file-upload'){
			// 			return field.id
			// 		}
			// 	})
			// 	// console.log(uploads)
			// 	// uploads.forEach(field => {
			// 	// 	console.log(field.id)
			// 	// })
			
				
	
			// 	// return first form
			// 	// eventData.response.status(200).send(response.getBody());
	
			// }).catch((err)=>console.error(err))


		
		
		// , function(error) {

		// 	eventData.response.status(404).send(error.getBody());
		// });
		
	} else {
		eventData.response.status(404).send('Not found');
	}

}

async function downloadAll(workspaceId){
	const count = await getTotalCount(workspaceId)
	const pages = await Math.ceil(count/100)+1;
	console.log(count);
	console.log(pages);
	const links = await getUrls(workspaceId, pages);
	let num = 0;

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
	console.log(pages)
	let currentPage = 1;
	const urls = []
	while(currentPage < pages){
		await console.log('current page ', currentPage);
		await znHttp().get(`/files.json?workspace.id=${workspaceId}&limit=100&page=${currentPage}`).then(function(response) {
			let formList = response.body;
			let fields = (JSON.parse(formList));
			fields.data.map((element)=>{
				console.log(element)
				urls.push({'url': element.downloadUrl, 'name': element.name +'.'+ element.extension});
			 })
		}).catch(err => console.error(err))
		await currentPage++;
	}
	if(currentPage>=pages){
		return urls
	}
}

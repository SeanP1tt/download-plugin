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

		var formId = eventData.request.body.id;
		console.log(formId);

		const accessToken = '';
const workspaceID=22420;
const workspaceName= ''
let uploadFields = [];
let pagesList = [];


let dir;
(async () => {

      const formList = await request.get({
          url: `https://api.zenginehq.com/v1/forms.json?workspace.id=${workspaceID}&access_token=${accessToken}`,
          json: true,
      }).catch(err => console.error(err));

      let forms = await formList.data.map(form => {
        return {id: form.id, name: form.name};
      })

      

      for(formId of forms){
  const fieldInfoRequest= await request.get({
    url:`https://api.zenginehq.com/v1/forms/${formId.id}/fields.json?type=file-upload&access_token=${accessToken}`,
    json: true }).catch(err => console.error(err)).then(fieldData => {
      if(fieldData.data){
        let id = fieldData.data.map(info => {
          return {fieldId: info.id, label: info.label, formId: formId.id, formName: formId.name} //changed this so need to update in other places
        })
        uploadFields.push(id);
      }
    }).then(uploadFields=uploadFields.flat(Infinity));
}



for(formId of forms){
const fileResult2 = await request.get({
    url: `https://api.zenginehq.com/v1/forms/${formId.id}/records.json?access_token=${accessToken}`,
    json: true,
}).catch(err => console.error(err)).then((data)=> {
  let pages = Math.floor(data.totalCount/100)+1;
pagesList.push(pages);

});

}

        let pageIndex=0;
        for (id of uploadFields){
          let count = 1;
          let currentPage = 1;
          while(currentPage < pagesList[pageIndex]+1){
          const fileResult = await request.get({
              url: `https://api.zenginehq.com/v1/files.json?workspace.id=${workspaceID}&resource=form_fields&resourceId=${id.fieldId}&access_token=${accessToken}&limit=100&page=${currentPage}`,
              json: true,
          }).catch(err => console.error(err))

          if (fileResult.data) {
        for (let i=0; i<=fileResult.data.length; i++){
          try{
            let useless= 0;
            (!fileResult.data[i].downloadUrl)?console.log(fileResult.data[i]):useless;
              let url = fileResult.data[i].downloadUrl;
              var filename = path.basename( url );
              let newFileName= fileResult.data[i].name + '.'+fileResult.data[i].extension;
              // TODO: check if file name exists in directory
              dir=`${workspaceName}/${id.formName}/${id.label}`;
              const location = __dirname + '/'+dir+'/'+newFileName;

  try {
    if (await fs.existsSync(location)) {
      //file exists
      newFileName= fileResult.data[i].name +'('+count+')'+ '.'+fileResult.data[i].extension;
        console.log('New File Name: ', newFileName);
        count++
    }
  } catch(err) {
    console.error(err);
  }
    //Code that downloads file:

  if (await !fs.existsSync(dir)){
      fs.mkdirSync(__dirname + '/'+dir, {recursive: true});
  }

    const path2file = path.resolve(dir, newFileName)
    const writer = fs.createWriteStream(path2file)

    const response = await Axios({
      url,
      method: 'GET',
      responseType: 'stream'
    })

    response.data.pipe(writer)

     new Promise((resolve, reject) => {
      writer.on('finish', resolve)
      writer.on('error', reject)
    })
  //Code that downloads file ends HERE
} catch(err) {
  console.error(err);
}
    }
  }
  currentPage++;
}
pageIndex++;
}
    process.exit(0);
})();

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

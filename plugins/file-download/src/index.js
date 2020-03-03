import React, { useState, useEffect } from 'react'
import { render } from 'react-dom'
import { znContext, znPluginData} from '@zenginehq/zengine-sdk'
import axios from 'axios'
import JSZip from 'jszip'
import JSZipUtils from 'jszip-utils'
import saveAs from 'save-as'


export const App = props => {
  const [context, setContext] = useState()
  const [show, setShow] = useState(false)
  const [form, setForm] =useState()

  useEffect(() => {
    if (!context) {
      znContext((err, contextData) => {
        if (err) {
          console.error(err)
        }

        setContext(contextData)
      })
    }
  }, [])

 const download = function(formId){
  const request = process.env.NODE_ENV === 'production'
    ? znPluginData({
      namespace: 'fileTransferSp',
      method: 'post',
      route: '/download',
      options:  {
        data: {
          formID: formId,
          workspaceID: 24721
        }
      }
    })
    : axios.post(
      `http://localhost:3000/workspaces/24721/fileTransferSp/download`,
      {
        formID: formId,
        workspaceID: 24721
      },
      {
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${process.env.token}` 
        }
      }
    )

let response = request.then((response)=>{
  let links = response.data;
  let zip = new JSZip();
  let count = 0;
  let zipFilename = "zipFilename.zip";
  zip.folder('test'); 
   links.forEach(function(file){
		let filename = "filename";
		// loading a file and add it in a zip file
		JSZipUtils.getBinaryContent(file.url, function (err, data) {
		   if(err) {
			  throw err;
       }
		   zip.file(file.name, data, {binary:true});
		   count++;
		   if (count == links.length) {
			zip.generateAsync({type:'blob'}).then(function(content) {
			   saveAs(content, zipFilename);
			});
		 }
		});
	  });
}).catch((err)=>console.error(err))
 } 

  if (!context) return <p>Loading...</p>

  return (<main>
    {/* <h1 style={{ textAlign: 'center' }}>Hello Zengine!</h1>
    <button
      onClick={e => setShow(!show)}
      disabled={!context}
    >
      {show ? 'Hide' : 'Show'} Context Data
    </button> */}
    {show && <pre>{JSON.stringify(context, null, 2)}</pre>}
    <br></br>
    <br></br>
    <button onClick={()=>{download(
            context.workspace.id
            )}}>
      Download All File Data
    </button>
    <br></br>
    {/* <button onClick={()=>console.log(form)}>
      Download data for a specific form
    </button> */}
  </main>)
}

render(<App />, document.getElementById('app'))

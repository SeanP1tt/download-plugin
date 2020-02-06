import React, { useState, useEffect } from 'react'
import { render } from 'react-dom'
import { znContext, znFiltersPanel} from '@zenginehq/zengine-sdk'
import axios from 'axios'


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
  let response = axios.post(`http://localhost:3000/workspaces/workspaces/24721/fileTransferSp/download`,
  { id: formId },
  { headers: { 'Content-Type': 'application/json' } }).catch((err)=>console.log('we got this error: ', err))
 } 

  if (!context) return <p>Loading...</p>

  return (<main>
    <h1 style={{ textAlign: 'center' }}>Hello Zengine!</h1>
    <button
      onClick={e => setShow(!show)}
      disabled={!context}
    >
      {show ? 'Hide' : 'Show'} Context Data
    </button>
    {show && <pre>{JSON.stringify(context, null, 2)}</pre>}
    <br></br>
    <br></br>
    <button>
      Download All File Data
    </button>
    <br></br>
    <br></br>
    <select onChange={(e) =>{
    setForm(e.target.value);
  }}>
        {context.workspace.forms.map(element =>
      <option key={element.id} value={element.id}>{element.name}</option>
    )}
    </select>
    <button onClick={()=>{download(
            form
            )}}>
      Filter
    </button>
    <br></br>
    <br></br>
    <button onClick={()=>console.log(form)}>
      Download data for a specific form
    </button>
  </main>)
}

render(<App />, document.getElementById('app'))

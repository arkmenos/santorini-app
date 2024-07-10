import React from 'react'
import ReactDOM from 'react-dom/client'
import { Approot } from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './app/store.ts'


ReactDOM.createRoot(document.getElementById('root')!).render(
 
  <Provider store={store}> 
     {/* <React.StrictMode> */}
      <Approot />
    {/* </React.StrictMode>, */}
  </Provider>
)

import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import './App.css'
import { AppProvider } from "./components/App/AppContext/AppContext"
import AppLayout from './components/App/AppLayout/AppLayout'


function App() {

   return (
      <div className="App">
         <AppProvider>
            <BrowserRouter>
               <AppLayout/>
            </BrowserRouter>
         </AppProvider>
      </div>
   )
}


export default App
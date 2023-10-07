import { useState,createContext } from 'react'


export const AppContext = createContext()


// provide the data for this context

export const AppProvider = (props) => {

    // AppContext State
    const [api,setApi] = useState(import.meta.env.VITE_API_URL)    
    const [bearer_token,setBearerToken] = useState('')
    const [app_user_name,setAppUserName] = useState('')
    const [status_msg,setStatusMsg] = useState('')

    return (
        <AppContext.Provider value={{bearer_token,setBearerToken,api,setApi,app_user_name,setAppUserName,status_msg,setStatusMsg}}>
            {props.children}
        </AppContext.Provider>
    )
}
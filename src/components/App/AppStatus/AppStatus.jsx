import React, { useState,useEffect,useContext } from 'react'
import { AppContext } from '../AppContext/AppContext'



// we employ a simple flash message for all status msgs and errors.
// for production, critical issues would be better as fixed notes 

const AppStatus = props => {

    // app-wide status msg
    const {status_msg,setStatusMsg} = useContext(AppContext)

    // we create a local copy to linger in the DOM long enough for css transition to affect the text too
    const [lingering_status_msg,setLingeringStatusMsg] = useState("")

    useEffect(() => {
        // eslint-disable-next-line
        let clear_message,clear_lingering_message // prev. comment prevents warning ("clear_message not used.."")
        if(status_msg !== "") {
            setLingeringStatusMsg(status_msg)
            clear_message = setTimeout(() => setStatusMsg(""),3000)
            clear_lingering_message = setTimeout(() => setLingeringStatusMsg(""),4000)
        }
        return (clear_message) => {
            clearTimeout(clear_message)
            clearTimeout(clear_lingering_message)
        }
    },[status_msg,setStatusMsg,setLingeringStatusMsg])

    return (
        <div className={`app_status h-fit text-left p-5 border rounded bg-slate-200 shadow ${status_msg !== "" ? 'app_status_bg' : ''}`}>
            {lingering_status_msg}
        </div>
    )
}


export default AppStatus
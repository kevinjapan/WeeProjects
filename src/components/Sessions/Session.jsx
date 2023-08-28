import React, { useState,useEffect,useContext } from 'react'
import { AppContext } from '../App/AppContext/AppContext'
import reqInit from '../Utility/RequestInit/RequestInit'
import get_ui_ready_date from '../Utility/Dates/Dates'
import { Notifications } from '../Utility/utilities/enums'
import Modal from '../Utility/Modal/Modal'
import StyledButton from '../Utility/StyledButton/StyledButton'
import EditSessionForm from './EditSessionForm/EditSessionForm'
import DeleteSessionForm from './DeleteSessionForm/DeleteSessionForm'
import { PencilIcon,TrashIcon } from '@heroicons/react/24/solid'


//
// to do : copied of sessions - adapt -> sessions are much simpler data
// eg unlikely we ever 'update' a session. (but perhaps modify ended_at ?)
//


// Session
//
// Sessions can only occupy a time duration over a single day - they do not extend over multiple days.
//
//

const Session = props => {

   const [session,setSession] = useState({})
   const [show_edit_modal,setShowEditModal] = useState(false)
   const [show_delete_modal,setShowDeleteModal] = useState(false)
   const {api,bearer_token,setStatusMsg} = useContext(AppContext)

   useEffect(() => {
      setSession(props.session)
   },[])

   const update_session = async(formJson) => {
      // eslint-disable-next-line
      let clear_message // prev. session prevents warning ("clear_message not used.."")
      try {
         setStatusMsg(Notifications.UPDATING)
         
         // to do : verify matches session API
         const data = await fetch(`${api}/sessions`,reqInit("PUT",bearer_token,formJson))

         const jsonData = await data.json()
         if(jsonData.outcome === Notifications.SUCCESS) {
            setSession(formJson)
         }
         setStatusMsg(Notifications.DONE)
         await new Promise(resolve => setTimeout(resolve, 1000))
         setStatusMsg('')
      }
      catch(error) {
         setStatusMsg(Notifications.FAILED_CONNECTION)
         setStatusMsg('Sorry, we are unable to update data on the server at this time.' + error)
      }
      setShowEditModal(false)
   }

   const delete_session = async (formJson) => {
      try {
         formJson.id = formJson.session_id
         setStatusMsg(Notifications.UPDATING)

         // to do : verify matches session API
         const data = await fetch(`${api}/sessions`,reqInit("DELETE",bearer_token,formJson))

         const jsonData = await data.json()
         await new Promise(resolve => setTimeout(resolve, 1000))
         if(jsonData.outcome === Notifications.SUCCESS) {
            props.remove_deleted_session(session.id)
         }
         setStatusMsg(Notifications.DONE)
         await new Promise(resolve => setTimeout(resolve, 1000))
         setStatusMsg('')
      }
      catch(error) {
         setStatusMsg(Notifications.FAILED_SERVER_UPDATE + error)
      }
      setShowEditModal(false)
   }

   return (
      <section className="border rounded p-2 text-slate-500">


         <p className="leading-relaxed">{get_ui_ready_date(session.started_at)}</p>
         <p className="leading-relaxed">{get_ui_ready_date(session.ended_at)}</p>
         <p className="text-sm">{session.author_id}</p>

         

         {/* <div className="flex gap-1 justify-end">
            <StyledButton aria-label="Edit session." onClicked={() => setShowEditModal(true)}>
               <PencilIcon style={{width:'16px',height:'16px'}}/>Edit
            </StyledButton>
            <StyledButton aria-label="Delete session." onClicked={() => setShowDeleteModal(true)}>
               <TrashIcon style={{width:'16px',height:'16px'}}/>Delete
            </StyledButton>
         </div>

         {show_edit_modal && (
            <Modal show={show_edit_modal} close_modal={() => setShowEditModal(false)}>
               <EditSessionForm 
                  onSubmit={update_session} 
                  session={session} 
                  is_unique={props.is_unique}
                  close_modal={() => setShowEditModal(false)}/>
            </Modal>)}

         {show_delete_modal && (
            <Modal show={show_delete_modal} close_modal={() => setShowDeleteModal(false)}>
               <DeleteSessionForm 
                  onSubmit={delete_session} 
                  session_id={session.id} 
                  close_modal={() => setShowDeleteModal(false)}/>
            </Modal>)} */}
      </section>
   )
}

export default Session
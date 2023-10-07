import React, { useState,useEffect,useContext } from 'react'
import { AppContext } from '../../App/AppContext/AppContext'
import reqInit from '../../Utility/RequestInit/RequestInit'
import SessionsManagerListItem from './SessionsManagerListItem/SessionsManagerListItem'
import { get_ui_ready_time,get_db_ready_datetime } from '../../Utility/DateTime/DateTime'
import { Notifications } from '../../Utility/utilities/enums'
import Modal from '../../Utility/Modal/Modal'
import EditSessionForm from '../EditSessionForm/EditSessionForm'
import DeleteSessionForm from '../DeleteSessionForm/DeleteSessionForm'



//
// SessionsManager
//
// Sessions rcvd from parent are simple json/string representations of dates -
// {id: 19, author_id: 1, started_at: '2023-08-28 12:07:20', ended_at: '2023-08-28 15:47:20', offset: 169}
// note : props.sessions will contain *all* sessions - including those w/ 'offset: null' - that's good!
// - we assume duplicates (on same day) are separate entries 
//


const SessionsManager = props => {

   // 'hydrate' and fill out emergent properties - eg duration
   const [hydrated_sessions,setHydratedSessions] = useState(props.sessions)

   // summary data
   const [total_duration,setTotalDuration] = useState(0)
   const [number_sessions,setNumberSessions] = useState(0)

   // session we are currently editing etc.
   const [selected_session,setSelectedSession] = useState({})

   // notifications
   const [show_edit_modal,setShowEditModal] = useState(false)
   const [show_delete_modal,setShowDeleteModal] = useState(false)
   const [local_status,setLocalStatus] = useState('')
   const {api,bearer_token,setStatusMsg} = useContext(AppContext)


   useEffect(() => {

      // deep-copy 'sessions' array   cf '[...props.sessions]' - shallow-copy only
      let modified_sessions =  JSON.parse(JSON.stringify(props.sessions))

      // calc & insert duration for each session
      modified_sessions.forEach(session => {

         const started_datetime = new Date(session.started_at)
         const ended_datetime = session.ended_at ? new Date(session.ended_at) : null

         // future : validate times
         let start_datetime = started_datetime.getTime()
         let end_datetime = ended_datetime ? ended_datetime.getTime() : null

         let duration = Math.round((((end_datetime - start_datetime) / 1000) / 60) / 60)

         // add new properties
         session['duration'] = duration > 0 ? duration : 0
         session['start_time'] = get_ui_ready_time(started_datetime)
         session['end_time'] = get_ui_ready_time(ended_datetime)
      })

      const total_hours = modified_sessions.reduce((current_total,item) => {
         return item.duration + current_total
      },0)

      setHydratedSessions(modified_sessions)
      setTotalDuration(total_hours)
      setNumberSessions(modified_sessions.length)

   },[props.sessions])

   const edit_session = (session_id) => {
      const target_session = hydrated_sessions.find((session) => parseInt(session.id) === parseInt(session_id))
      setSelectedSession(target_session)
      setShowEditModal(true)
   }

   const end_session = (session_id) => {

      // we know UI only provides 'end now' option on valid today sessions

      let date = new Date()
      let selected_session = hydrated_sessions.find((session) => parseInt(session.id) === parseInt(session_id))
      selected_session.ended_at = get_db_ready_datetime(date)

      update_session(selected_session)
   }


   // future : 
   // - validate ended_at against started_at dates

   const update_session = async(formJson) => {

      // eslint-disable-next-line
      let clear_message // prev. comment prevents warning ("clear_message not used.."")

      try {
         setLocalStatus(Notifications.UPDATING)
         const data = await fetch(`${api}/sessions`,reqInit("PUT",bearer_token,formJson))
         const jsonData = await data.json()
         

         if(jsonData.outcome === Notifications.SUCCESS) {

            // update local copy of Session
            setSelectedSession(formJson) 
            
            // refresh dataset
            props.update_session()
         }

         setLocalStatus(Notifications.DONE)
         
         setLocalStatus('')
      }
      catch(error) {
         setLocalStatus(Notifications.FAILED_CONNECTION)
         setStatusMsg('Sorry, we are unable to update data on the server at this time.' + error)
      }
      setShowEditModal(false)
   }


   const confirm_delete_session = () => {
      setShowEditModal(false)
      setShowDeleteModal(true)
   }

   const delete_session = async (formJson) => {
      
      try {
         setLocalStatus(Notifications.UPDATING)
         const data = await fetch(`${api}/sessions`,reqInit("DELETE",bearer_token,formJson))
         const jsonData = await data.json()
         
         if(jsonData.outcome === Notifications.SUCCESS) {
            
            // refresh dataset
            props.remove_deleted_session()

         }
         setLocalStatus(Notifications.DONE)
         
         setLocalStatus('')
      }
      catch(error) {
         setStatusMsg(Notifications.FAILED_SERVER_UPDATE + error)
      }
      setShowDeleteModal(false)
   }


   return (
      <section className="border border-gray-400 rounded p-2 text-slate-500 shadow-lg">
         <h5>Sessions</h5>
         {number_sessions} sessions / 
         total time: {total_duration} hours
         <ul className="">
            {hydrated_sessions.map((session,index) => (
               <SessionsManagerListItem 
                  key={index}
                  session={session}
                  edit_session={edit_session}
                  end_session={end_session}
               />
            ))}
         </ul>

         {show_edit_modal && (
            <Modal show={show_edit_modal} close_modal={() => setShowEditModal(false)}>
               <EditSessionForm 
                  onSubmit={update_session} 
                  onDelete={confirm_delete_session} 
                  session={selected_session} 
                  is_unique={props.is_unique}
                  close_modal={() => setShowEditModal(false)}/>
            </Modal>
         )}

         {show_delete_modal && (
            <Modal show={show_delete_modal} close_modal={() => setShowDeleteModal(false)}>
               <DeleteSessionForm 
                  onSubmit={delete_session} 
                  session_id={selected_session.id} 
                  close_modal={() => setShowDeleteModal(false)}/>
            </Modal>
         )}

      </section>
   )
}

export default SessionsManager
import React, { useState,useContext } from 'react'
import { AppContext } from '../App/AppContext/AppContext'
import reqInit from '../Utility/RequestInit/RequestInit'
import Modal from '../Utility/Modal/Modal'
import StyledButton from '../Utility/StyledButton/StyledButton'
import { PlusIcon } from '@heroicons/react/24/solid'
import Calendar from '../Calendar/Calendar'
import AddSessionForm from './AddSessionForm/AddSessionForm'



const SessionsPanel = props => {

   const [sessions,setSessions] = useState(props.sessions)
   const {api,bearer_token,setStatusMsg} = useContext(AppContext)
   const [show_add_modal,setShowAddModal] = useState(false)

   const remove_deleted_session = deleted_session_id => {
      setSessions(sessions.filter((session) => session.id !== deleted_session_id))
   }

   const add_session = async(formJson) => {
      try {

         // to do : verify matches session API
         const data = await fetch(`${api}/sessions`,reqInit("POST",bearer_token,formJson))

         const jsonData = await data.json()
         await new Promise(resolve => setTimeout(resolve, 1000))
         
         if(jsonData.outcome === 'success') {
            formJson['id'] = jsonData.id
            let modified_sessions = sessions ? [...sessions] : []
            if(!modified_sessions.some(todo => todo.id === formJson.id)) {
               modified_sessions.push(formJson)
            }
            setSessions(modified_sessions)
         }
         else {
            setStatusMsg("Server couldn't create a new session")
         }
      }
      catch (err){
         setStatusMsg('Sorry, we are unable to update data on the server at this time. ' + err)
      }
      setShowAddModal(false)
   }

   const is_unique = (item_id,item_field,value) => {
      if(!sessions) return true
      const filtered_sessions = sessions.filter(session => parseInt(session.id) !== parseInt(item_id))
      return filtered_sessions ? !filtered_sessions.some(session => session[item_field] === value) : true
   }

   const manage_sessions = () => {
      props.manage_sessions()
   }


   return (
      <section className=" my-2 max-w-3xl mx-auto">

         <Calendar sessions={sessions}/>         
         
         <div className="flex justify-end">
            <StyledButton aria-label="Add a session." onClicked={() => manage_sessions()} classes="flex gap-1">
               Manage sessions
            </StyledButton>
            <StyledButton aria-label="Add a session." onClicked={() => setShowAddModal(true)} classes="flex gap-1">
               <PlusIcon style={{width:'16px',height:'16px'}}/>Add session
            </StyledButton>
         </div>

         {show_add_modal && (
            <Modal show={show_add_modal} close_modal={() => setShowAddModal(false)}>
               <AddSessionForm 
                  sessionable_type={props.sessionable_type}
                  sessionable_id={props.sessionable_id}
                  onSubmit={add_session}
                  is_unique={is_unique}
                  close_modal={() => setShowAddModal(false)}/>
            </Modal>)}

      </section>
   )
}

export default SessionsPanel
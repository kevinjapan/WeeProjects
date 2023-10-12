import React, { useState,useEffect,useContext } from 'react'
import { Link,useParams } from 'react-router-dom'
import { AppContext } from '../App/AppContext/AppContext'
import reqInit from '../Utility/RequestInit/RequestInit'
import StyledButton from '../Utility/StyledButton/StyledButton'
import { PlusIcon } from '@heroicons/react/24/solid'
import Message from './Message'
import Modal from '../Utility/Modal/Modal'
import AddMessageForm from './AddMessageForm/AddMessageForm'


const MessageBoard = props => {

   let params = useParams()
   const {api,bearer_token,setStatusMsg} = useContext(AppContext)

   const [project_id,setProjectId] = useState(0)
   const [messages,setMessages] = useState([])
   const [get_messages_outcome,setGetMessagesOutcome] = useState('')    // 'success' may still be empty 'messages'
   const [adding_message,setAddingMessage] = useState(false)
   const [show_add_modal,setShowAddModal] = useState(false)

   
   useEffect (() => {
      get_messages()
   },[])

   const get_messages = async() => {

      try {
         const data = await fetch(`${api}/projects/${params.project_slug}/messageboard/messages`,reqInit("GET",bearer_token))
         const jsonData = await data.json()

         setGetMessagesOutcome(jsonData.outcome)

         if(jsonData.outcome === 'success') {
            setMessages(jsonData.data)
            // we retrieve project_id from returned dataset
            if(jsonData.project_id) {
               setProjectId(jsonData.project_id)
            }
         }
         else {
            setStatusMsg(jsonData.message ? jsonData.message : "Messages not found.")
         }
      } catch (error){
         setStatusMsg('Sorry, we are unable to retrieve data from the server at this time. ' + error)
      }
   }


   const add_message = async(formJson) => {

      if(formJson['project_id'] === null || formJson['project_id'] === '' || formJson['project_id'] === 0) {
         setStatusMsg("The project_id was invalid, please refresh and try again.")
      }

      try {

         setAddingMessage(true)

         const data = await fetch(`${api}/projects/${params.project_slug}/messageboard/messages`,reqInit("POST",bearer_token,formJson))
         const jsonData = await data.json()
         
         
         if(jsonData.outcome === 'success') {
            formJson['id'] = jsonData.id
            let modified_messages = messages ? [...messages] : []
            if(!modified_messages.some(message => message.id === formJson.id)) {
               modified_messages.push(formJson)
            }
            setMessages(modified_messages)

            //props.update_messages(modified_messages)
         }
         else {
            setStatusMsg("Server couldn't create a new Message")
         }
      }
      catch (err){
         setStatusMsg('Sorry, we are unable to update data on the server at this time. ' + err)
      }
      setAddingMessage(false)
      setShowAddModal(false)
   }

   const is_unique = (item_id,item_field,value) => {

      if(!messages) return true
      const filtered_messages = messages.filter(message => parseInt(message.id) !== parseInt(item_id))
      return filtered_messages ? !filtered_messages.some(message => message[item_field] === value) : true

   }

   const update_messages = updated_message => {
      
      let index = messages.findIndex(message => parseInt(message.id) === parseInt(updated_message.id))
      let modified = [...messages]
      modified[index] = updated_message
      setMessages(modified)

   }


   const remove_deleted_message = deleted_message_id => {
      let modified = messages.filter((message) => message.id !== deleted_message_id)
      setMessages(modified)
   }


   return (
      <>
      {messages && get_messages_outcome === 'success'
         ?  <section className="flex flex-col m-5">

               <Link to={`/projects/${params.project_slug}`} className="self-center border rounded-3xl px-3 text-blue-300">
                  {params.project_slug} <span className="text-slate-400 italic">- back to project</span></Link>
            
               {messages 
                  ?  <div className="text-slate-400 italic self-center my-5">This project has {messages.length} message{messages.length === 1 ? '' : 's'}</div>
                  :  <div className="text-slate-400 italic self-center my-5">This project has no messages.</div>
               }
               <ul className="flex flex-col gap-12 p-1">
                  {messages ? 
                     messages.map(message => (
                        <Message 
                           key={message.id} 
                           message={message}
                           is_unique={is_unique}
                           update_messages={update_messages}
                           remove_deleted_message={remove_deleted_message}
                        />
                     ))
                  :null}
               <StyledButton classes="self-center" aria-label="Add a new task." onClicked={() => setShowAddModal(true)}>
                  <PlusIcon style={{width:'16px',height:'16px'}}/>Add A Message
               </StyledButton>
            </ul>
         </section>
         :  null}


       
            
         {show_add_modal && (
            <Modal show={show_add_modal} close_modal={() => setShowAddModal(false)}>
               <AddMessageForm 
                  project_id={project_id}
                  onSubmit={add_message} 
                  is_unique={is_unique} 
                  close_modal={() => setShowAddModal(false)}  
               />
            </Modal>
         )}  


      </>
   )
   
}

export default MessageBoard
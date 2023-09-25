import React, { useState,useEffect,useContext } from 'react'
import { Link,useParams } from 'react-router-dom'
import { AppContext } from '../App/AppContext/AppContext'
import reqInit from '../Utility/RequestInit/RequestInit'
import StyledButton from '../Utility/StyledButton/StyledButton'
import { PlusIcon } from '@heroicons/react/24/solid'
import Message from './Message'
import Modal from '../Utility/Modal/Modal'
import AddMessageForm from './AddMessageForm/AddMessageForm'
//import EditMessageForm from './EditMessageForm/EditMessageForm'
//import DeleteMessageForm from './DeleteMessageForm/DeleteMessageForm'


const MessageBoard = props => {

   let params = useParams()
   const {api,bearer_token,setStatusMsg} = useContext(AppContext)

   const [project_id,setProjectId] = useState(0)
   const [messages,setMessages] = useState([])
   const [show_edit_modal,setShowEditModal] = useState(false)
   const [show_add_modal,setShowAddModal] = useState(false)
   const [show_delete_modal,setShowDeleteModal] = useState(false)

   
   useEffect (() => {
      get_messages()
   },[])
   const get_messages = async() => {

      try {
         const data = await fetch(`${api}/projects/${params.project_slug}/messageboard/messages`,reqInit("GET",bearer_token))
         const jsonData = await data.json()
         if(jsonData.outcome === 'success') {
            
            setMessages(jsonData.data)

            // we retrieve project_id from returned dataset
            if(jsonData.project_id) {
               setProjectId(jsonData.project_id)
            }

            // to do : equivalent required?
            // if(selected_task) {
            //    const selected_task_id = selected_task.id
            //    const updated_selected_task = jsonData.data.filter(task => parseInt(task.id) === parseInt(selected_task_id))
            //    setSelectedTask(updated_selected_task[0])
            //    setTaskUpdated(task_updated + 1)
            // }
         }
         else {
            setStatusMsg("Server couldn't retrieve updated Messages list.")
         }
      } catch (error){
         setStatusMsg('Sorry, we are unable to retrieve data from the server at this time. ' + error)
      }
   }

   const add_message = () => {
      console.log('to do : add a message then..')
   }


   return (
      <>
         <section className="flex flex-col m-5">

            <div>project id: {project_id}</div>

            <Link to={`/projects/${params.project_slug}`} className="self-center text-blue-600">
               <span className="text-slate-400 italic">Back to Project</span> {params.project_slug}</Link>
         
            <div className="text-slate-400 italic self-center">{messages.length} message{messages.length === 1 ? '' : 's'}</div>

            <ul className="flex flex-col gap-12 p-1">
               {messages ? 
                  messages.map(message => (
                     <Message key={message.id} message={message}/>
                  ))
               :null}
               <StyledButton classes="self-center" aria-label="Add a new task." onClicked={() => setShowAddModal(true)}>
                  <PlusIcon style={{width:'16px',height:'16px'}}/>Add A Message
               </StyledButton>
            </ul>

         </section>

         {/* {show_edit_modal && (
            <Modal show={show_edit_modal} close_modal={() => setShowEditModal(false)}>
               <EditMessageForm 
                  onSubmit={update_message} 
                  is_unique={props.is_unique} 
                  message={message} 
                  setShowDeleteModal={setShowDeleteModal}
                  onDelete={confirm_delete_message} 
                  close_modal={() => setShowEditModal(false)}
               />
            </Modal>
         )} */}

         {/* {show_delete_modal && (
            <Modal show={show_delete_modal} close_modal={() => setShowDeleteModal(false)}>
               <DeleteMessageForm 
                  onSubmit={delete_message} 
                  close_modal={() => setShowDeleteModal(false)} 
               />
            </Modal>
         )} */}
            
         {show_add_modal && (
            <Modal show={show_add_modal} close_modal={() => setShowAddModal(false)}>
               <AddMessageForm 
                  project_id={project_id}
                  onSubmit={add_message} 
                  // is_unique={is_unique} 
                  close_modal={() => setShowAddModal(false)}  
               />
            </Modal>
         )}  


      </>
   )
   
}

export default MessageBoard
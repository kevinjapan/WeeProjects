import React, { useState,useEffect,useContext } from 'react'
import { Link,useParams } from 'react-router-dom'
import { AppContext } from '../../../App/AppContext/AppContext'
import reqInit from '../../../Utility/RequestInit/RequestInit'
import { Notifications } from '../../../Utility/utilities/enums'
import get_ui_ready_date from '../../../Utility/DateTime/DateTime'
import Modal from '../../../Utility/Modal/Modal'
import EditMessageManagerForm from './EditMessageManagerForm/EditMessageManagerForm'
import DeleteMessageManagerForm from './DeleteMessageManagerForm/DeleteMessageManagerForm'
// import StyledButton from '../../../Utility/StyledButton/StyledButton'
// import { TrashIcon } from '@heroicons/react/24/solid'



const MessagesManager = () => {
   
   let params = useParams()
   const {api,bearer_token,setStatusMsg} = useContext(AppContext)
   
   const [messages,setMessages] = useState([])
   const [selected_message,setSelectedmessage] = useState({})
   const [show_edit_modal,setShowEditModal] = useState(false)
   const [show_delete_modal,setShowDeleteModal] = useState(false)
   const [local_status,setLocalStatus] = useState('')

   
   useEffect(() => {
      const get_messages = async (api) => {
         try {
            const data = await fetch(`${api}/projects/${params.project_slug}/messageboard/messages_inclusive`,reqInit("GET",bearer_token))
            const jsonData = await data.json()
            if(jsonData.outcome === 'success') {
               setMessages(jsonData.data)
            } 
            else {
               
               // setLoadingStatus(jsonData.message)
            }
         } catch {
            setStatusMsg('Sorry, unable to fetch data from the server.')
         }
      }
      get_messages(api,params)
   },[api,params.project_slug])

   
   const confirm_delete_message = () => {
      setShowEditModal(false)
      setShowDeleteModal(true)
   }

   const delete_message = async (formJson) => {
      
      try {
         setLocalStatus(Notifications.UPDATING)

         const data = await fetch(`${api}/projects/${params.project_slug}/messageboard/messages/delete_permanently/${formJson.id}`,reqInit("DELETE",bearer_token,selected_message))
         
         const jsonData = await data.json()
         

         if(jsonData.outcome === Notifications.SUCCESS) {

            // we don't reset this - we don't mind that form contains prev Todo - it's not accessible
            // setSelectedmessage({})

            // refresh UI list
            let modified = messages.filter((message) => message.id !== selected_message.id)
            setMessages(modified)
         }

         setLocalStatus(Notifications.DONE)
         
         setLocalStatus('')
      }
      catch(error) {
         setStatusMsg(Notifications.FAILED_SERVER_UPDATE + error)
      }
      setShowDeleteModal(false)
   }

   const edit_message = message => {
      setSelectedmessage(message)
      setShowEditModal(true)
   }


   return (
      <section className="w-11/12 m-2 mx-10 p-5 border rounded">
      
         <h5>
            {params.project_slug} &nbsp;
            <Link to={`/dashboard/artefacts/projects/${params.project_slug}/tasks`} className="text-blue-600">Tasks</Link>&nbsp;&nbsp;
            <span className="font-bold">Messages</span>
         </h5>

         <h6 className="w-fit text-slate-500 ml-5 mt-2 bg-yellow">{messages.length} message{messages.length !== 1 ? 's' : ''}</h6>

         <section className="m-5">
            <table className="w-full my-5">
               <thead className="text-slate-400 font-thin">
                  <tr>
                     <td className="px-3 pt-0.5">title</td>
                     <td className="px-3 pt-0.5">created</td>
                     <td className="px-3 pt-0.5">last update</td>
                     <td className="px-3 pt-0.5">deleted_at</td>
                     <td></td>
                  </tr>
               </thead>
               <tbody>
                  {messages.map((message) => (
                     <tr key={message.id} className="border-b hover:bg-yellow-100 cursor-default">

                        <td className="">{message.title}</td>
                        <td className="">{get_ui_ready_date(message.created_at)}</td>
                        <td className="">{get_ui_ready_date(message.updated_at)}</td>
                        <td className="">{get_ui_ready_date(message.deleted_at)}</td>

                        <td>
                           <div onClick={() => edit_message(message)} className="text-blue-600 cursor-pointer">edit</div>
                           {/* <StyledButton aria-label="Edit this message." onClicked={() => setShowEditModal(true)}>
                              <TrashIcon style={{width:'16px',height:'16px'}}/>Permanently Delete
                           </StyledButton> */}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </section>
         
         {show_edit_modal && (
               <Modal show={show_edit_modal} close_modal={() => setShowEditModal(false)}>
                  <EditMessageManagerForm 
                     message={selected_message}
                     // is_unique={props.is_unique}
                     close_modal={() => setShowEditModal(false)}
                     // onSubmit={update_todo} 
                     onDelete={confirm_delete_message}
                  />
               </Modal>
         )}

         {show_delete_modal && (
               <Modal show={show_delete_modal} close_modal={() => setShowDeleteModal(false)}>
                  <DeleteMessageManagerForm 
                     message_id={selected_message.id} 
                     onSubmit={delete_message} 
                     // close_modal={() => setShowDeleteModal(false)}
                  />
               </Modal>
         )}

      </section>
   )
}

export default MessagesManager
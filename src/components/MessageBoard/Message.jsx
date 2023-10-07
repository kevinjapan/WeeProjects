import React, { useState,useEffect,useContext } from 'react'
import { AppContext } from '../App/AppContext/AppContext'
import { Notifications } from '../Utility/utilities/enums'
import reqInit from '../Utility/RequestInit/RequestInit'
import NavBar from '../App/NavBar/NavBar'
import CommentsList from '../Comments/CommentsList'
import MessageToggler from './MessageToggler/MessageToggler'
import Modal from '../Utility/Modal/Modal'
import EditMessageForm from './EditMessageForm/EditMessageForm'
import DeleteMessageForm from './DeleteMessageForm/DeleteMessageForm'
import StyledButton from '../Utility/StyledButton/StyledButton'
import { PencilIcon } from '@heroicons/react/24/solid'
import truncate from '../Utility/Stringer/uiStringer'
import get_ui_ready_date, {get_ui_ready_time, get_db_ready_datetime} from '../Utility/DateTime/DateTime'

const Message = props => {

   const {api,bearer_token,setStatusMsg} = useContext(AppContext)
   const [message,setMessage] = useState(props.message)
   const [is_open,setIsOpen] = useState(false)
   const [show_edit_modal,setShowEditModal] = useState(false)
   const [show_delete_modal,setShowDeleteModal] = useState(false)
   const [local_status,setLocalStatus] = useState('')

   
   useEffect(() => { 
      setMessage(props.message)
   },[props.message])


   const update_message = async(formJson) => {

      // eslint-disable-next-line
      let clear_message // prev. comment prevents warning ("clear_message not used.."")

      try {
         setLocalStatus(Notifications.UPDATING)

         const data = await fetch(`${api}/projects/${props.project_slug}/messageboard/messages/${message.id}`,reqInit("PUT",bearer_token,formJson))
         const jsonData = await data.json()
         

         if(jsonData.outcome === Notifications.SUCCESS) {
            setMessage(formJson)
            props.update_messages(formJson)
         }

         setLocalStatus(Notifications.DONE)
         
         setLocalStatus('')
      }
      catch(error) {
         setLocalStatus(Notifications.FAILED_CONNECTION)
         //setStatusMsg('Sorry, we are unable to update data on the server at this time.' + error)
      }
      setShowEditModal(false)
   }

   const confirm_delete_message = () => {
      setShowEditModal(false)
      setShowDeleteModal(true)
   }

   const delete_message = async (formJson) => {

      // for future : retain 'formJson' and 'message' - no benefit to throw the data away

      let date = new Date()                                    
      message['deleted_at'] = get_db_ready_datetime(date)

      try {
         setLocalStatus(Notifications.UPDATING)
         
         const data = await fetch(`${api}/projects/${props.project_slug}/messageboard/messages/${message.id}`,reqInit("DELETE",bearer_token,message))
         const jsonData = await data.json()
         

         if(jsonData.outcome === Notifications.SUCCESS) {
            // update local copy of parent Task

            props.remove_deleted_message(message.id)
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
      <>
      <li className={"w-full border border-slate-500 rounded-xl shadow-lg px-5 pt-3 pb-7"} >

      
         <NavBar title={props.message.title} >
            <ul className="flex flex-row w-full">
               <li>
                  <StyledButton aria-label="Edit this task." onClicked={() => setShowEditModal(true)}>
                     <PencilIcon style={{width:'16px',height:'16px'}}/>Edit
                  </StyledButton>
               </li>
               {/* 
               <li>
                  <div onClick={() => close_message()} className="float-right mr-2 p-2 cursor-pointer text-lg" >X</div>
               </li> 
               */}
            </ul>
         </NavBar>

   
         <section className="p-5 pt-2">
            <div className="flex justify-between">
               <div>
                  <span className="text-slate-400 italic">posted by</span>&nbsp;&nbsp;{props.message.author_id}&nbsp;&nbsp;
                  <span className="text-slate-400 italic">on</span>&nbsp;&nbsp;{get_ui_ready_date(props.message.created_at)}&nbsp;&nbsp;
                  <span className="text-slate-400 italic">at</span>&nbsp;&nbsp;{get_ui_ready_time(props.message.created_at)}
               </div>
               <MessageToggler is_open={is_open} toggle={setIsOpen} />
            </div>

            {is_open
               ?  <>
                     <div className="pt-6" style={{whiteSpace:'pre-line'}}>{props.message.body}</div> 
                     <section className="w-10/12 ml-auto mr-12">              
                        <CommentsList 
                           commentable_type="message"
                           no_type_in_heading={true}
                           commentable_id={props.message.id}
                           comments={props.message.comments} 
                        />
                     </section>
                  </>
               :  <section>
                     <div className="pt-6" >{truncate(props.message.body,250)}</div>
                  </section>
            }
         
            {is_open
               ?  <MessageToggler is_open={is_open} toggle={setIsOpen} />
               :  null
            }
         </section>
      </li>

        {show_edit_modal && (
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
         )}

         {show_delete_modal && (
            <Modal show={show_delete_modal} close_modal={() => setShowDeleteModal(false)}>
               <DeleteMessageForm 
                  onSubmit={delete_message} 
                  close_modal={() => setShowDeleteModal(false)} 
               />
            </Modal>
         )}
         </>
   )
   
}

export default Message
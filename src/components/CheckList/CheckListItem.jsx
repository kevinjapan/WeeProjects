import React, { useState,useEffect,useContext } from 'react'
import { AppContext } from '../App/AppContext/AppContext'
import { datetimestamp } from '../Utility/DateTime/DateTime'
import { Notifications } from '../Utility/utilities/enums'
import reqInit from '../Utility/RequestInit/RequestInit'
import Modal from '../Utility/Modal/Modal'
import EditCheckListItemForm from './EditCheckListItemForm/EditCheckListItemForm'
import DeletechecklistItemForm from './DeletechecklistItemForm/DeletechecklistItemForm'
import { BookmarkIcon } from '@heroicons/react/24/outline'



const CheckListItem = props => {

   const [checklistitem,setCheckListItems] = useState(props.checklistitem)
   const {api,bearer_token,setStatusMsg} = useContext(AppContext)
   const [checked,setChecked] = useState(false)
   const [local_status,setLocalStatus] = useState('')
   const [show_edit_modal,setShowEditModal] = useState(false)
   const [show_delete_modal,setShowDeleteModal] = useState(false)

   useEffect(() => { 
      props.checklistitem.done_at === null ? setChecked(false) : setChecked(props.checklistitem.done_at)
   },[props.checklistitem.done_at])

   const check_checklistitem = async(modified_checklistitem) => {

      setLocalStatus(Notifications.UPDATING)

      // update server
      update_checklistitem(modified_checklistitem)
   }

   const update_checklistitem = async(formJson) => {

      // eslint-disable-next-line
      let clear_message // prev. comment prevents warning ("clear_message not used.."")
      
      try {
         setLocalStatus(Notifications.UPDATING)

         const data = await fetch(`${api}/checklistitems/${checklistitem.id}`,reqInit("PUT",bearer_token,formJson))
         const jsonData = await data.json()
         

         if(jsonData.outcome === Notifications.SUCCESS) {

            // update local copy of checklistitem
            setCheckListItems(formJson)

            // update local copy of parent Task
            props.update_list()
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

   const confirm_delete_checklistitem = () => {
      setShowEditModal(false)
      setShowDeleteModal(true)
   }

   const delete_checklistitem = async (formJson) => {

      try {
         setLocalStatus(Notifications.UPDATING)
         const data = await fetch(`${api}/${props.project_slug}/${props.task_slug}/${props.todo_slug}/checklistitems/${checklistitem.id}`,reqInit("DELETE",bearer_token,checklistitem))
         const jsonData = await data.json()
         

         if(jsonData.outcome === Notifications.SUCCESS) {
            props.remove_deleted_checklistitem(checklistitem.id)
         }
         
         setLocalStatus(Notifications.DONE)
         
         setLocalStatus('')
      }
      catch(error) {
         setStatusMsg(Notifications.FAILED_SERVER_UPDATE + error)
      }
      setShowEditModal(false)
   }

   const view_checklistitem_details = () => {
      //props.view_checklistitem_details(checklistitem)
   }

   let item_classes = 'w-full border rounded px-1 py-0.5 '
   let title_classes = 'p-0.5 cursor-pointer hover:bg-yellow-200 leading-tight'
   if(parseInt(props.selected_checklistitem_id) === checklistitem.id) {
      item_classes += ' border-blue-900'
   }

   return (
      <>
         <li 
            key={props.checklistitem.id} 
            className={`${item_classes} ${checklistitem.on_going && !checked > 0 ? 'bg-yellow-200' : ''}`}
         >

            <div className="flex justify-between gap-1 items-center w-full m-0">

               {checklistitem.pin 
                  ?  <BookmarkIcon style={{width:'16px',height:'16px',opacity:'.7'}}/> 
                  :  <BookmarkIcon style={{width:'16px',height:'16px',opacity:'.3'}}/> 
               }
            

               {/* list_item checkbox */}

               <input type="checkbox" checked={checked || false}
                  onChange={e => {
                     check_checklistitem({
                        ...checklistitem,
                        done_at: e.target.checked ? datetimestamp() : null,
                        pin:0,
                        on_going:0,
                     }) 
                  }}
               />


               {/* title */}

               <div className="w-full">
                  <div className={`${title_classes} ${checked ? 'line-through text-zinc-400 hover:text-zinc-600' : ''} `} 
                     onClick={() => view_checklistitem_details()}>{checklistitem.title}</div>
               </div>

               {/* open the checklistitem item view */}
               {/* <StyledButton aria-label="Delete this task." onClicked={() => view_checklistitem_details()}>
                  <BookOpenIcon style={{width:'16px',height:'16px'}}/>View
               </StyledButton> */}

               {/* open in separate window..
                <div>
                  <Link to={`/projects/${props.project_slug}/${props.task_slug}/${checklistitem.slug}`}>
                     <StyledButton aria-label="Open checklistitem.">
                        <BookOpenIcon style={{width:'12px',height:'12px'}}/>View
                     </StyledButton>
                  </Link>
               </div> */}
            <div className={`${title_classes} ${checked ? 'text-zinc-400 hover:text-zinc-600' : ''} `} 
               onClick={() => setShowEditModal(true)}>edit</div>
            </div>

            {/* status dropdown */}

            {local_status ? <div className="w-full text-slate-400 text-sm">{local_status}</div> : <div></div>}

         </li>

         {show_delete_modal && (
            <Modal show={show_delete_modal} close_modal={() => setShowDeleteModal(false)}>
               <DeletechecklistItemForm 
                  onSubmit={delete_checklistitem} 
                  checklistitem_id={checklistitem.id} 
                  close_modal={() => setShowDeleteModal(false)}/>
            </Modal>
         )}

         {show_edit_modal && (
            <Modal show={show_edit_modal} close_modal={() => setShowEditModal(false)}>
               <EditCheckListItemForm 
                  todo_id={props.todo_id}
                  checklistitem={checklistitem}
                  onSubmit={update_checklistitem} 
                  checklistitem_id={checklistitem.id} 
                  close_modal={() => setShowEditModal(false)}
                  onDelete={confirm_delete_checklistitem} 
                  // is_unique={props.is_unique}
               />    
            </Modal>
         )}
            
      </>
   )
}

export default CheckListItem
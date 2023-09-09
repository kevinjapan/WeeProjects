import React, { useState,useEffect,useContext } from 'react'
import { AppContext } from '../App/AppContext/AppContext'
import reqInit from '../Utility/RequestInit/RequestInit'
import CheckListItem from './CheckListItem'
import Modal from '../Utility/Modal/Modal'
import StyledButton from '../Utility/StyledButton/StyledButton'
import AddCheckListItemForm from './AddCheckListItemForm/AddCheckListItemForm'
import { PlusIcon } from '@heroicons/react/24/solid'



// we retrieve checklists when user opens parent TodoCard
// future : review : currently reloads every time we open a TodoCard

const CheckList = props => {

   const [todo_id] = useState(props.todo_id)
   const [checklistitems,setCheckListItems] = useState(props.checklistitems)
   const [selected_checklistitem_id,setSelectedCheckListItemId] = useState(0)
   const [show_add_modal,setShowAddModal] = useState(false)
   const [adding_checklistitem,setAddingCheckListItem] = useState(false)
   const {api,bearer_token,setStatusMsg} = useContext(AppContext)

   useEffect(() => {
      get_checklistitems()
   },[props.todo_id])

   const get_checklistitems = async() => {

      try {
         const data = await fetch(`${api}/${props.project_slug}/${props.task_slug}/${props.todo_slug}/checklistitems/${todo_id}`,reqInit("GET",bearer_token))
         const jsonData = await data.json()
         await new Promise(resolve => setTimeout(resolve, 1000))
         if(jsonData.outcome === 'success') {
            setCheckListItems(jsonData.data)
         }
         else {
            setStatusMsg("Server couldn't retrieve updated checklistitems list.")
         }
      } catch (error){
         setStatusMsg('Sorry, we are unable to retrieve data from the server at this time. ' + error)
      }
   }

   const check_checklistitem = modified_checklistitem => {
      console.log(modified_checklistitem)
      let modified_checklistitems = checklistitems.map(checklistitem => {
         if(checklistitem.id === modified_checklistitem.id) {
            checklistitem.done_at = modified_checklistitem.done_at
         }
         return checklistitem
      })
      setCheckListItems(modified_checklistitems)
   }

   const remove_deleted_checklistitem = deleted_checklistitem_id => {
      let modified = checklistitems.filter((checklistitem) => checklistitem.id !== deleted_checklistitem_id)
      setCheckListItems(modified)
   }

   const update_list = () => {
      get_checklistitems()
   }

   const add_checklistitem = async(formJson) => {

      try {
         setAddingCheckListItem(true)

         const data = await fetch(`${api}/checklistitems`,reqInit("POST",bearer_token,formJson))
         const jsonData = await data.json()
         await new Promise(resolve => setTimeout(resolve, 1000))
         
         if(jsonData.outcome === 'success') {
            formJson['id'] = jsonData.id
            let modified_checklistitems = checklistitems ? [...checklistitems] : []
            if(!modified_checklistitems.some(checklistitem => checklistitem.id === formJson.id)) {
               modified_checklistitems.push(formJson)
            }
            setCheckListItems(modified_checklistitems)
         }
         else {
            setStatusMsg("Server couldn't create a new CheckListItem")
         }
      }
      catch (err){
         setStatusMsg('Sorry, we are unable to update data on the server at this time. ' + err)
      }
      setAddingCheckListItem(false)
      setShowAddModal(false)
   }

   const is_unique = (item_id,item_field,value) => {
      if(!checklistitems) return true
      const filtered_checklistitems = checklistitems.filter(setAddingCheckListItem => parseInt(setAddingCheckListItem.id) !== parseInt(item_id))
      return filtered_checklistitems ? !filtered_checklistitems.some(setAddingCheckListItem => setAddingCheckListItem[item_field] === value) : true
   }

   return (
      <>
         {todo_id ? <h5 className="text-slate-400 text-lg">CheckList</h5> : null}

         <ul className="flex flex-col gap-1 p-0 my-3 list-none w-full ">
            {checklistitems ? 
               checklistitems.map(checklistitem => (

                  <CheckListItem 
                     todo_id={todo_id}
                     key={checklistitem.id} 
                     project_slug={props.project_slug}
                     task_slug={props.task_slug}
                     checklistitem={checklistitem} 
                     selected_checklistitem_id={selected_checklistitem_id}
                     is_unique={is_unique}
                     update_list={update_list}
                     check_checklistitem={check_checklistitem}
                     remove_deleted_checklistitem={remove_deleted_checklistitem}
                  />
                  
               ))
            : <h6 className="text-center text-slate-300 mt-1">Loading...</h6>}
            {adding_checklistitem && (
               <li className="h-fit text-left p-1 border rounded bg-yellow-50" style={{color:'lightgrey'}}>creating on server..</li>
            )}
         </ul>

         <div className="navbar">
            <div>{/* title slot (spacing) */}</div>
            {adding_checklistitem 
               ?  <StyledButton aria-label="Add a checklistitem." disabled>
                     <PlusIcon style={{width:'16px',height:'16px'}}/>Add
                  </StyledButton>
               :  <StyledButton aria-label="Add a checklistitem." onClicked={() => setShowAddModal(true)} >
                     <PlusIcon style={{width:'16px',height:'16px'}}/>Add
                  </StyledButton> 
            }
         </div>

         {/* 'is_unique' is a generic function to allow the child Form component to query *any* field within the List items 
              - typically, we are checking an added 'title' is unique */}
         {show_add_modal && (
            <Modal show={show_add_modal} close_modal={() => setShowAddModal(false)}>
               <AddCheckListItemForm
                  onSubmit={add_checklistitem} 
                  is_unique={is_unique} 
                  todo_id={todo_id}
                  close_modal={() => setShowAddModal(false)}
               />
            </Modal>
         )}
      </>
   )
}

export default CheckList
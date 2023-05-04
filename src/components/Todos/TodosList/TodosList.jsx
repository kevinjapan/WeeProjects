import React, { useState,useEffect,useContext } from 'react'
import { AppContext } from '../../App/AppContext/AppContext'
import reqInit from '../../Utility/RequestInit/RequestInit'
import TodosListItem from './TodosListItem'
import Modal from '../../Utility/Modal/Modal'
import StyledButton from '../../Utility/StyledButton/StyledButton'
import AddTodoForm from '../AddTodoForm/AddTodoForm'
import { PlusIcon } from '@heroicons/react/24/solid'



const Todos = props => {

   const [todos,setTodos] = useState(props.todos)
   const [task_slug,setTaskSlug] = useState("")
   const [show_add_modal,setShowAddModal] = useState(false)
   const [adding_todo,setAddingTodo] = useState(false)
   const {api,bearer_token,setStatusMsg} = useContext(AppContext)

   useEffect(() => {
      setTaskSlug(props.task_slug)
   },[props.task_slug])
   
   const check_todo = modified_todo => {
      let modified_todos = todos.map(todo => {
         if(todo.id === modified_todo.id) {
               todo.done_at = modified_todo.done_at
         }
         return todo
      })
      setTodos(modified_todos)
   }

   const remove_deleted_todo = deleted_todo_id => {
      let modified = todos.filter((todo) => todo.id !== deleted_todo_id)
      setTodos(modified)
      props.update_todos(modified)
   }

   const add_todo = async(formJson) => {
      try {
         let project_slug = props.project_slug
         setAddingTodo(true)

         const data = await fetch(`${api}/${project_slug}/${task_slug}/todos`,reqInit("POST",bearer_token,formJson))
         const jsonData = await data.json()
         await new Promise(resolve => setTimeout(resolve, 1000))
         
         if(jsonData.outcome === 'success') {
            formJson['id'] = jsonData.id
            let modified_todos = todos ? [...todos] : []
            if(!modified_todos.some(todo => todo.id === formJson.id)) {
               modified_todos.push(formJson)
            }
            setTodos(modified_todos)
            props.update_todos(modified_todos)
         }
         else {
            setStatusMsg("Server couldn't create a new Todo")
         }
      }
      catch (err){
         setStatusMsg('Sorry, we are unable to update data on the server at this time. ' + err)
      }
      setAddingTodo(false)
      setShowAddModal(false)
   }

   const is_unique = (item_id,item_field,value) => {
      if(!todos) return true
      const filtered_todos = todos.filter(todo => parseInt(todo.id) !== parseInt(item_id))
      return filtered_todos ? !filtered_todos.some(todo => todo[item_field] === value) : true
   }

   return (
      <>
         <ul className="flex flex-col gap-1 p-0 my-3 list-none w-full ">
               {todos ? 
                  todos.map(todo => (
                     <TodosListItem
                        key={todo.id} 
                        project_slug={props.project_slug}
                        task_slug={props.task_slug}
                        todo={todo} 
                        check_todo={check_todo}
                        is_unique={is_unique}
                        remove_deleted_todo={remove_deleted_todo}
                     />
                  ))
               :null}
               {adding_todo && (
                  <li className="h-fit text-left p-1 border rounded bg-yellow-50" style={{color:'lightgrey'}}>creating on server..</li>
               )}
         </ul>

         <div className="navbar">
            <div>{/* title slot (spacing) */}</div>
            {adding_todo 
               ?  <StyledButton aria-label="Add a todo." disabled>
                     <PlusIcon style={{width:'16px',height:'16px'}}/>Add
                  </StyledButton>
               :  <StyledButton aria-label="Add a todo." onClicked={() => setShowAddModal(true)} >
                     <PlusIcon style={{width:'16px',height:'16px'}}/>Add
                  </StyledButton> 
            }
         </div>

         {/* 'is_unique' is a generic function to allow the child Form component to query *any* field within the List items 
              - typically, we are checking an added 'title' is unique */}
         {show_add_modal && (
            <Modal show={show_add_modal} close_modal={() => setShowAddModal(false)}>
               <AddTodoForm onSubmit={add_todo} is_unique={is_unique} close_modal={() => setShowAddModal(false)}/>
            </Modal>
         )}
      </>
   )
}

export default Todos
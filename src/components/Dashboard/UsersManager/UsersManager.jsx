import React, { useState,useEffect,useContext } from 'react'
import { Link,useParams } from 'react-router-dom'
import { AppContext } from '../../App/AppContext/AppContext'
import reqInit from '../../Utility/RequestInit/RequestInit'
import { Notifications } from '../../Utility/utilities/enums'
import get_ui_ready_date, { get_db_ready_datetime } from '../../Utility/DateTime/DateTime'
import Modal from '../../Utility/Modal/Modal'
import StyledButton from '../../Utility/StyledButton/StyledButton'
import { PlusIcon } from '@heroicons/react/24/solid'
import AddUserForm from './AddUserForm/AddUserForm'
import EditUserForm from './EditUserForm/EditUserForm'
import DeleteUserForm from './DeleteUserForm/DeleteUserForm'  
import PermanentlyDeleteUserForm from './PermanentlyDeleteUserForm/PermanentlyDeleteUserForm'   




const UsersManager = () => {
   
   let params = useParams()
   const {api,bearer_token,setStatusMsg} = useContext(AppContext)
   
   const [users,setUsers] = useState([])
   const [selected_user,setSelectedUser] = useState({})
   const [show_add_modal,setShowAddModal] = useState(false)
   const [show_edit_modal,setShowEditModal] = useState(false)
   const [show_delete_modal,setShowDeleteModal] = useState(false)
   const [show_permanently_delete_modal,setShowPermanentlyDeleteModal] = useState(false)
   const [local_status,setLocalStatus] = useState('')

   
   useEffect(() => {
      const get_users = async (api) => {
         
         try {
            const data = await fetch(`${api}/users/usersmanager/users/users_inclusive`,reqInit("GET",bearer_token))

            const jsonData = await data.json()
            if(jsonData.outcome === 'success') {
               setUsers(jsonData.data)
            } 
            else {
               // setLoadingStatus(jsonData.user)
            }
         } catch {
            setStatusMsg('Sorry, unable to fetch data from the server.')
         }
      }
      get_users(api,params)
   },[api,params.project_slug])




   const add_user = async(formJson) => {

      try {
         // let project_slug = props.project_slug
         //setAddingUser(true)

         const data = await fetch(`${api}/users/usersmanager`,reqInit("POST",bearer_token,formJson))
         const jsonData = await data.json()
         
         
         if(jsonData.outcome === 'success') {
            formJson['id'] = jsonData.id
            let modified_users = users ? [...users] : []
            if(!modified_users.some(user => user.id === formJson.id)) {
               modified_users.push(formJson)
            }
            setUsers(modified_users)
         }
         else {
            setStatusMsg("Server couldn't create a new user")
         }
      }
      catch (err){
         setStatusMsg('Sorry, we are unable to update data on the server at this time. ' + err)
      }
      //setAddinguser(false)
      setShowAddModal(false)
   }
   
   
   const update_user = async(formJson) => {

      // eslint-disable-next-line
      let clear_message // prev. comment prevents warning ("clear_message not used.."")

      try {
         setLocalStatus(Notifications.UPDATING)

         const data = await fetch(`${api}/users/usersmanager/${formJson['id']}`,reqInit("PUT",bearer_token,formJson))
         const jsonData = await data.json()
         

         if(jsonData.outcome === Notifications.SUCCESS) {

            // to do : for some reason, deleted_at is not being preserved in local copy..

            // numeric sort of project ids
            let projects_array = formJson['projects'].split(',')
            projects_array.sort(function(a,b) {return a - b})
            formJson['projects'] = projects_array.toString()

            let index = users.findIndex((user) => parseInt(user.id) === parseInt(formJson.id))
            let modified = [...users]
            modified[index] = formJson
            setUsers(modified)
            
            setLocalStatus(Notifications.DONE)
            setLocalStatus('')
         }
      }
      catch(error) {
         setLocalStatus(Notifications.FAILED_CONNECTION)
         setStatusMsg('Sorry, we are unable to update data on the server at this time.' + error)
      }
      setShowEditModal(false)
   }


   const confirm_delete_user = () => {
      setShowEditModal(false)
      setShowDeleteModal(true)
   }

   const delete_user = async (formJson) => {

      let date = new Date()                                    
      formJson['deleted_at'] = get_db_ready_datetime(date)

      try {
         const data = await fetch(`${api}/users/usersmanager/users/${formJson['id']}`,reqInit("DELETE",bearer_token,formJson))
         const jsonData = await data.json()
         

         if(jsonData.outcome === 'success') {

            // const deleted_project_id = project.id
            // dispatch({type: 'delete_project_local_copy'})
            // let modified = users.filter((user) => user.id !== formJson['id'])
            // setUsers[...modified]

            let index = users.findIndex((user) => parseInt(user.id) === parseInt(formJson['id']))
            let deleted_user = users[index]
            deleted_user['deleted_at'] = formJson['deleted_at']
            
         } 
         else {
            setStatusMsg(jsonData.message ? jsonData.message : "Sorry, we couldn't delete the User.")
         }
      } catch(error) {
         setStatusMsg('Sorry, we are unable to update data on the server at this time.' + error)
      }
      setShowDeleteModal(false)
   }


   const confirm_permanently_delete_user = () => {
      setShowEditModal(false)
      setShowPermanentlyDeleteModal(true)
   }


   const permanently_delete_user = async (formJson) => {
      try {
         setLocalStatus(Notifications.UPDATING)

         const data = await fetch(`${api}/users/usersmanager/users/${formJson['id']}/delete_permanently`,reqInit("DELETE",bearer_token,formJson)) 
         const jsonData = await data.json()
         
         if(jsonData.outcome === Notifications.SUCCESS) {
            let modified = users.filter((user) => user.id !== formJson['id'])
            setUsers([...modified])
         }
         else {
            setStatusMsg(jsonData.message ? jsonData.message : "Sorry, we couldn't permantently delete the User.")
         }
      }
      catch(error) {
         setStatusMsg(Notifications.FAILED_SERVER_UPDATE + error)
      }
      setShowPermanentlyDeleteModal(false)
   }

   const edit_user = user => {
      setSelectedUser(user)
      setShowEditModal(true)
   }

   const is_unique = (item_id,item_field,value) => {

      // future : check at server
      // currently only checks current user list on client (ok just now)

      if(!users) return true
      // exclude selected User from check
      const filtered_users = users.filter(user => parseInt(user.id) !== parseInt(item_id))
      // check no other User has that field value already
      return filtered_users ? !filtered_users.some(user => user[item_field] === value) : true
   }



   return (
      <section className="w-11/12 m-2 mx-10 p-5 border rounded">
      
         <h5>
            <span className="font-bold">Users</span>
         </h5>

         <h6 className="w-fit text-slate-500 ml-5 mt-2 bg-yellow">{users.length} user{users.length !== 1 ? 's' : ''}</h6>

         <section className="m-5">
            <table className="w-full my-5">
               <thead className="text-slate-400 font-thin">
                  <tr>
                     <td className="px-3 pt-0.5">username</td>
                     <td className="px-3 pt-0.5">email</td>
                     <td className="px-3 pt-0.5">created</td>
                     <td className="px-3 pt-0.5">last update</td>
                     <td className="px-3 pt-0.5">deleted_at</td>
                     <td></td>
                  </tr>
               </thead>
               <tbody>
                  {users.map((user) => (
                     <tr key={user.id} className="border-b hover:bg-yellow-100 cursor-default">

                        <td className="">{user.user_name}</td>
                        <td className="">{user.email}</td>
                        {/* to do : this is incorrectly showing on 'update' */}
                        <td className="">{user.created_at ? get_ui_ready_date(user.created_at) : <span className="text-slate-400">today</span>}</td>
                        <td className="">{get_ui_ready_date(user.updated_at)}</td>
                        <td className="">{get_ui_ready_date(user.deleted_at)}</td>

                        <td>
                           <div onClick={() => edit_user(user)} className="text-blue-600 cursor-pointer">edit</div>
                           {/* <StyledButton aria-label="Edit this user." onClicked={() => setShowEditModal(true)}>
                              <TrashIcon style={{width:'16px',height:'16px'}}/>Permanently Delete
                           </StyledButton> */}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </section>

         <StyledButton aria-label="Add a user." onClicked={() => setShowAddModal(true)} >
                     <PlusIcon style={{width:'16px',height:'16px'}}/>Add
                  </StyledButton> 
         
         {show_add_modal && (
            <Modal show={show_add_modal} close_modal={() => setShowAddModal(false)}>
               <AddUserForm
                  onSubmit={add_user} 
                  is_unique={is_unique} 
                  close_modal={() => setShowAddModal(false)}
               />
            </Modal>
         )}
         
         {show_edit_modal && (
            <Modal show={show_edit_modal} close_modal={() => setShowEditModal(false)}>
               <EditUserForm 
                  user={selected_user}
                  is_unique={is_unique}
                  close_modal={() => setShowEditModal(false)}
                  onSubmit={update_user} 
                  onDelete={confirm_delete_user}
                  onPermanentlyDelete={confirm_permanently_delete_user}
               />
            </Modal>
         )}

         {show_delete_modal && (
            <Modal show={show_delete_modal} close_modal={() => setShowDeleteModal(false)}>
               <DeleteUserForm 
                  user_id={selected_user.id} 
                  onSubmit={delete_user} 
                  close_modal={() => setShowDeleteModal(false)}
               />
            </Modal>
         )}


         {show_permanently_delete_modal && (
            <Modal show={show_permanently_delete_modal} close_modal={() => setShowPermanentlyDeleteModal(false)}>
               <PermanentlyDeleteUserForm 
                  user_id={selected_user.id} 
                  onSubmit={permanently_delete_user} 
                  close_modal={() => setShowPermanentlyDeleteModal(false)}
               />
            </Modal>
         )}

      </section>
   )
}

export default UsersManager
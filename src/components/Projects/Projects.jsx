import React, { useState,useEffect,useContext } from 'react'
import { Routes,Route } from 'react-router-dom'
import { AppContext } from '../App/AppContext/AppContext'
import reqInit from '../Utility/RequestInit/RequestInit'
import ProjectsList from './ProjectsList/ProjectsList'
import ProjectContainer from './ProjectContainer/ProjectContainer'
import TaskContainer from '../Tasks/Task/TaskContainer'
import MessageBoard from '../MessageBoard/MessageBoard'

const Projects = () => {

   // we lifted projects here so EditProjectForm etc can check for duplicate titles etc.

   const [projects,setProjects] = useState([])
   const {api,bearer_token,setStatusMsg} = useContext(AppContext)
   const [adding_project,setAddingProject] = useState(false)
   const [asc,setAsc] = useState(true)

   useEffect(() => {
      const get_projects = async(api) => {
         try {
            const data = await fetch(`${api}/`,reqInit("GET",bearer_token))
            const jsonData = await data.json()

            if(jsonData.outcome === 'success') {
               setProjects(jsonData.data)
            } 
            else {
               setStatusMsg(jsonData.message ? jsonData.message : "Sorry, we couldn't retrieve Projects.")
            }
         } catch(error) {
            setStatusMsg('Sorry, we were unable to fetch data from the server. [' + error + ']')
         }
      }
      get_projects(api)
   },[api,setStatusMsg])
   

   const add_project = async(formJson) => {
      try {
         setAddingProject(true)
         const data = await fetch(`${api}/projects`,reqInit("POST",bearer_token,formJson))
         const jsonData = await data.json()
         
         if(jsonData.outcome === 'success') {
            let modified = [...projects]
            if(!modified.some(todo => todo.id === formJson.id)) {
               modified.push(jsonData.data)
            }
            setProjects(modified)
         }
         else {
            setStatusMsg("Server couldn't create new Project")
         }
      }
      catch (err){
         setStatusMsg('Sorry, we are unable to update data on the server at this time. ' + err)
      }
      setAddingProject(false)
   }
   
   const order_by = selected_col => {
      let modified = []    
      if(asc) {
         modified = projects.sort((a,b) => {
            if(a[selected_col] < b[selected_col]) return -1
            if(a[selected_col] > b[selected_col]) return 1
            return 0 // no sort
         })
      } 
      else {
         modified = projects.sort((a,b) => {
            if(a[selected_col] > b[selected_col]) return -1
            if(a[selected_col] < b[selected_col]) return 1
            return 0 // no sort
         })
      }
      setProjects([...modified])
      setAsc(!asc)
   }

   const update_project_in_list = updated_project => {
      
      let index = projects.findIndex(project => parseInt(project.id) === parseInt(updated_project.id))      
      let modified = [...projects]
      modified[index] = updated_project
      setProjects(modified)
   
   }

   const removed_deleted_project = deleted_project_id => {
      let modified = projects.filter(project => parseInt(project.id) !== parseInt(deleted_project_id))
      setProjects([...modified])
   }

   const is_unique = (item_id,item_field,value) => {
      if(!projects) return true
      const filtered_projects = projects.filter(project => parseInt(project.id) !== parseInt(item_id))
      return filtered_projects ? !filtered_projects.some(project => project[item_field] === value) : true
   }

   return (
      <Routes>

         <Route path="/" 
            element={
               <ProjectsList 
                  projects={projects} 
                  adding_project={adding_project}
                  order_by={order_by}
                  add_project={add_project} 
                  is_unique={is_unique} 
               />
            }
         /> 

         <Route path="/:project_slug" 
            element={
               <ProjectContainer 
                  is_unique={is_unique} 
                  update_project_in_list={update_project_in_list}
                  removed_deleted_project={removed_deleted_project}
               />
            } 
         /> 

         <Route path="/:project_slug/messageboard" 
            element={<MessageBoard />}          
         />
            
         <Route path="/:project_slug/:task_slug" 
            element={<TaskContainer />}            
         />

      </Routes>
   )
}

export default Projects
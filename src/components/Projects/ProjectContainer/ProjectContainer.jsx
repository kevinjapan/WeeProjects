import React, { useState,useEffect,useContext } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../App/AppContext/AppContext'
import reqInit from '../../Utility/RequestInit/RequestInit'
import Project from '../Project/Project'



const ProjectContainer = props => {

   const [project,setProject] = useState({})
   const {api,setStatusMsg} = useContext(AppContext)
   const [loading_status,setLoadingStatus] = useState('loading..')
   let params = useParams()

   useEffect(() => {
      const get_project = async (api,slug) => {
         try {
               const data = await fetch(`${api}/projects/${slug}`,reqInit())
               const jsonData = await data.json()
               if(jsonData.outcome === 'success') {
                  setProject(jsonData.data)
               } else {
                  await new Promise(resolve => setTimeout(resolve, 1000))
                  setLoadingStatus(jsonData.message)
               }
         } catch {
               setStatusMsg('Sorry, unable to fetch data from the server.')
         }
      }
      get_project(api,params.project_slug)
   },[api,params.project_slug,setStatusMsg])

   return (
      Object.keys(project).length !== 0  ?
         <Project 
            project={project} 
            is_unique={props.is_unique} 
            update_project_in_list={props.update_project_in_list}
            />
         :   <div>{loading_status}</div>
   )
}

export default ProjectContainer
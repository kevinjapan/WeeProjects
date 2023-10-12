import React, { useState,useEffect,useContext } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../App/AppContext/AppContext'
import reqInit from '../../Utility/RequestInit/RequestInit'
import Project from '../Project/Project'



const ProjectContainer = props => {

   const [project,setProject] = useState({})
   const {api,bearer_token,setStatusMsg} = useContext(AppContext)
   const [loading_status,setLoadingStatus] = useState('loading..')
   let params = useParams()

   // our initial retrieval returns a snapshot of the Project to initialise our UI,
   // thereafter, async ops are carried out at lower component levels.
   useEffect(() => {
      const get_project = async (api,slug) => {
         try {
            const data = await fetch(`${api}/projects/${slug}`,reqInit("GET",bearer_token))
            const jsonData = await data.json()
            if(jsonData.outcome === 'success') {
               setProject(jsonData.data)
            } 
            else {
               setStatusMsg(jsonData.message ? jsonData.message : "Sorry, we couldn't retrieve Project.")
            }
         } catch {
               setStatusMsg('Sorry, unable to fetch data from the server.')
         }
      }
      get_project(api,params.project_slug)
   },[api,params.project_slug,setStatusMsg])


   return (
      Object.keys(project).length !== 0
         ?  <Project 
               project={project} 
               is_unique={props.is_unique} 
               update_project_in_list={props.update_project_in_list}
               removed_deleted_project={props.removed_deleted_project}
            />
         :  <h6 className="text-center text-slate-400 mt-24">Loading...</h6>
   )
}

export default ProjectContainer
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import get_ui_ready_date from '../../Utility/DateTime/DateTime'
import Modal from '../../Utility/Modal/Modal'
import StyledButton from '../../Utility/StyledButton/StyledButton'
import AddProjectForm from '../AddProjectForm/AddProjectForm'


import { useNavigate } from "react-router-dom"     // to do : remove test



const ProjectsList = props => {

   const [show_add_modal,setShowAddModal] = useState(false)
   const [adding_project] = useState(false)
   
   const navigate = useNavigate()     // to do : remove test

   const add_project = formJson => {
      props.add_project(formJson)
      setShowAddModal(false)
   }


   // ------------------------------------------------------------------------------------
   // to do : remove once testing completed
   // we are testing against users not registered with the 'WeeProjects' project.
   const test = type => {
      switch(type) {
         case 'todo':
            navigate('/projects/WeeProjects/features/verify-updates-work')
            break
         case 'task':
            navigate('/projects/WeeProjects/api')
            break
         case 'messageboard':
            navigate('/projects/WeeProjects/messageboard')
            break
         default:
            navigate('/projects/WeeProjects')
            break

      }
   }
   // ------------------------------------------------------------------------------------



   return (
      <>
         {/* 
         ------------------------------------------------------------------------------------------------------ 
            to do : remove this section
            testing user accessing projects etc via urls (deep-linking/history etc) (no link provided) 
         */}
         <section className="flex gap-1 bg-yellow-100 border rounded m-2 p-5">
            <h6>test links to WeeProjects project</h6>
            <a className="cursor-pointer text-blue-400 border m-1 p-1" onClick={() => test('project')}>project</a>
            <a className="cursor-pointer text-blue-400 border m-1 p-1" onClick={() => test('task')}>task</a>
            <a className="cursor-pointer text-blue-400 border m-1 p-1" onClick={() => test('todo')}>todo</a>
            <a className="cursor-pointer text-blue-400 border m-1 p-1" onClick={() => test('messageboard')}>messageboard</a>
         </section>
         {/* 
         ------------------------------------------------------------------------------------------------------ 
         */}
         {props.projects
            ?  props.projects.length > 0
                  ?  <section className="m-5">
                        <table className="w-full my-5">
                           <tbody>
                              <tr>
                                 <td className="pt-1 text-gray-400">
                                    <a className="cursor-pointer" onClick={() => props.order_by('title')}>title</a></td>
                                 <td className="pt-1 text-gray-400">
                                    <a className="cursor-pointer text-grey-100" onClick={() => props.order_by('created_at')}>started</a></td>
                                 <td className="pt-1 text-gray-400">
                                    <a className="cursor-pointer" onClick={() => props.order_by('updated_at')}>updated</a></td>
                              </tr>
                              {props.projects.map((item) => (
                                 <tr key={item.id} >
                                    <td className="pt-1"><Link to={`/projects/${item.slug}`}>{item.title}</Link></td>
                                    <td className="pt-1"><Link to={`/projects/${item.slug}`}>{get_ui_ready_date(item.created_at)}</Link></td>
                                    <td className="pt-1"><Link to={`/projects/${item.slug}`}>{get_ui_ready_date(item.updated_at)}</Link></td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>

                        <div className="navbar">
                           {adding_project 
                              ?   <StyledButton aria-label="Add a project." disabled>Add Project</StyledButton>
                              :   <StyledButton aria-label="Add a project." onClicked={() => setShowAddModal(true)}>Add Project</StyledButton>
                           }
                        </div>
                     
                        {show_add_modal && (
                           <Modal show={show_add_modal} close_modal={() => setShowAddModal(false)}>
                              <AddProjectForm onSubmit={add_project} is_unique={props.is_unique} close_modal={() => setShowAddModal(false)}/>
                           </Modal>
                        )}
                     </section>
                  :  <>
                        {/* there are no projects to display - likely user is not logged in. */}
                     </>
            :  <section className="m-20">
                  You have no assigned Projects.
               </section>
         }
      </>
   )
}

export default ProjectsList
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import get_ui_ready_date from '../../Utility/Dates/Dates'
import Modal from '../../Utility/Modal/Modal'
import StyledButton from '../../Utility/StyledButton/StyledButton'
import AddProjectForm from '../AddProjectForm/AddProjectForm'


const ProjectsList = props => {

   const [show_add_modal,setShowAddModal] = useState(false)
   const [adding_project] = useState(false)

   const add_project = formJson => {
      props.add_project(formJson)
      setShowAddModal(false)
   }

   return (
      props.projects && (
         <>
            <table className="w-full">
               <tbody>
                  <tr>
                     <td><a className="cursor-pointer" onClick={() => props.order_by('title')}>title</a></td>
                     <td><a className="cursor-pointer" onClick={() => props.order_by('created_at')}>made</a></td>
                     <td><a className="cursor-pointer" onClick={() => props.order_by('updated_at')}>updated</a></td>
                  </tr>
                  {props.projects.map((item) => (
                     <tr key={item.id}>
                           <td><Link to={`/projects/${item.slug}`}>{item.title}</Link></td>
                           <td><Link to={`/projects/${item.slug}`}>{get_ui_ready_date(item.created_at)}</Link></td>
                           <td><Link to={`/projects/${item.slug}`}>{get_ui_ready_date(item.updated_at)}</Link></td>
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
         </>
      ) 
   )
}

export default ProjectsList
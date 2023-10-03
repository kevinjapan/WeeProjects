import React, { useState,useContext } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../../App/AppContext/AppContext'      // to do : for dev..
import get_ui_ready_date from '../../Utility/DateTime/DateTime'
import Modal from '../../Utility/Modal/Modal'
import StyledButton from '../../Utility/StyledButton/StyledButton'
import AddProjectForm from '../AddProjectForm/AddProjectForm'


const ProjectsList = props => {

   const {bearer_token} = useContext(AppContext)    // to do : for dev...

   const [show_add_modal,setShowAddModal] = useState(false)
   const [adding_project] = useState(false)

   const add_project = formJson => {
      props.add_project(formJson)
      setShowAddModal(false)
   }

   return (
      props.projects && (
         <section className="m-5">

            <div style={{maxWidth:'32rem',overflow:'hidden',color:'lightgrey'}}>{bearer_token}</div> {/* to do : remove - dev only */}

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
      ) 
   )
}

export default ProjectsList
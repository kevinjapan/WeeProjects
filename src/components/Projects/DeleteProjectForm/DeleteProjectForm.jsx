import React from 'react'
import StyledButton from '../../Utility/StyledButton/StyledButton'



// captures user confirmation

const DeleteProjectForm = props => {

   const handleSubmit = e => {
      e.preventDefault()
      const form = e.target
      const formData = new FormData(form)
      const formJson = Object.fromEntries(formData.entries());
      // formJson :  eg  {title: 'Title entered by the user', author_id: '1'}
      props.onSubmit(formJson)
   }

   return (
      <form onSubmit={handleSubmit}>
         <h5 className="text-2xl mb-5">Delete Project</h5>
         <p>Are you sure you wish to delete this Project?</p>
         <input name="project_slug" type="hidden" value="" />
         <div className="flex justify-end gap-1 my-1">
               <StyledButton aria-label="Apply." type="submit">Apply</StyledButton>
               <StyledButton aria-label="Cancel." type="button" onClicked={props.close_modal} >Cancel</StyledButton>
         </div>
      </form>
   )
}


export default DeleteProjectForm
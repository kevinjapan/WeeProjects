import React from 'react'
import StyledButton from '../../../Utility/StyledButton/StyledButton'


// captures user confirmation
// future : merge w/ DeleteUserForm.

const DeleteUserManagerForm = props => {

   const handleSubmit = e => {
      e.preventDefault()
      const form = e.target
      const formData = new FormData(form)
      const formJson = Object.fromEntries(formData.entries());
      props.onSubmit(formJson)
   }

   return (
      <form onSubmit={handleSubmit}>
         <h5 className="text-2xl mb-5">Delete user</h5>
         <p>Are you sure you wish to <span className="font-bold">permantently</span> delete this User?</p>
         <input name="id" type="hidden" value={props.user_id} />
         <div className="flex justify-end gap-1 my-1">
               <StyledButton aria-label="Apply." type="submit">Apply</StyledButton>
               <StyledButton aria-label="Cancel." onClicked={props.close_modal}>Cancel</StyledButton>
         </div>
      </form>
   )
}

export default DeleteUserManagerForm
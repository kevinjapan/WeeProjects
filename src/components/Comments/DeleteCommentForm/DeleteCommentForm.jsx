import React from 'react'
import StyledButton from '../../Utility/StyledButton/StyledButton'



// captures user confirmation

const DeleteCommentForm = props => {

   const handleSubmit = e => {
      e.preventDefault()
      const form = e.target
      const formData = new FormData(form)
      const formJson = Object.fromEntries(formData.entries());
      props.onSubmit(formJson)
   }

   return (
      <form onSubmit={handleSubmit}>
         <h5 className="text-2xl mb-5">Delete Comment</h5>
         <p>Are you sure you wish to delete this Comment?</p>
         <input name="comment_id" type="hidden" value={props.comment_id} />
         <div className="flex justify-end gap-1 my-1">
            <StyledButton aria-label="Apply." type="submit">Apply</StyledButton>
            <StyledButton aria-label="Cancel." onClicked={props.close_modal}>Cancel</StyledButton>
         </div>
      </form>
   )
}

export default DeleteCommentForm
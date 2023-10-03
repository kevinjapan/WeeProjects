import React, { useState } from 'react'
import StyledButton from '../../../Utility/StyledButton/StyledButton'
import { validate_int, validate_string } from '../../../Utility/Validation/uiValidation'
import FormElement from '../../../Utility/Forms/FormElement/FormElement'
import StyledInput from '../../../Utility/StyledInput/StyledInput'
import StyledTextArea from '../../../Utility/StyledTextArea/StyledTextArea'
import FormElementFeedback from '../../../Utility/Forms/FormElementFeedback/FormElementFeedback'
import { generate_slug } from '../../../Utility/Stringer/uiStringer'
import { datetimestamp } from '../../../Utility/DateTime/DateTime'


//
// Most editing of an artefact is through the UI front-end.
// Currently, this form is essentially for deletion, inputs have been set to 'readonly'.
// 


const EditUserManagerForm = props => {

   const [id] = useState(props.user.id)
   const [username,setUsername] = useState(props.user.username)
   const [email,setEmail] = useState(props.user.email)
   const [password,setPassword] = useState(props.user.password)      // to do : password is an update field only - don't show existing..
   const [projects,setProjects] = useState(props.user.projects)
   const [deleted_at,setDeletedAt] = useState(props.user.deleted_at)

   // created_at / updated_at / deleted_at

   const [username_feedback,setUsernameFeedback] = useState('')
   const [email_feedback,setEmailFeedback] = useState('')
   const [password_feedback,setPasswordFeedback] = useState('')
   const [projects_feedback,setProjectsFeedback] = useState('')

   const handleSubmit = e => {
      
      setUsernameFeedback('')
      setEmailFeedback('')
      setPasswordFeedback('')
      setProjectsFeedback('')

      e.preventDefault()
      
      const form = e.target
      const formData = new FormData(form)
      const formJson = Object.fromEntries(formData.entries());

      let validated = true

      formJson['username'] = formJson['username'].trim()
   
      // to do : ensure we have unique usernames.. is_unique is complete test/search?
      if(!props.is_unique(formJson['id'],'username',formJson['username'])) {
         setUsernameFeedback('This username already exists, please enter a different username.')
         validated = false
      }

      if(!validate_string(formJson['username'],{'min_length':3,'max_length':120},setUsernameFeedback)) {
         validated = false
      }

      if(!validate_string(formJson['email'],{'min_length':10,'max_length':120},setEmailFeedback)) {
         validated = false
      }
      // to do : validate password
      // if(!validate_string(formJson['password'],{'min_length':10,'max_length':120},setPasswordFeedback)) {
      //    validated = false
      // }

      // to do : validation on projects list..  - may be null
      // if(!validate_string(formJson['projects'],{'min_length':10,'max_length':120},setProjectsFeedback)) {
      //    validated = false
      // }
      
      
      if(validated) props.onSubmit(formJson)
   }


   return (
      <form onSubmit={handleSubmit}>

         <h5 className="text-2xl mb-5">Edit User</h5>


         <div className="flex">

         
            <section className="w-2/12">

               <FormElement>
                  <label htmlFor="id" className="italic pt-1 w-12/12 md:w-6/12">Id</label>  
                  <StyledInput 
                     name="id" 
                     value={id || ''}
                     readonly
                     classes="w-6/12"></StyledInput>
               </FormElement>
               <FormElementFeedback />

            </section>

            
            <section className="w-10/12 pl-12">

               <FormElement>
                  <label htmlFor="username" className="italic pt-1 w-12/12 md:w-1/12">Username</label>  
                  <StyledInput 
                     name="username" 
                     value={username || ''}
                     onChanged={setUsername}
                     classes="w-11/12"
                  ></StyledInput>
               </FormElement>
               <FormElementFeedback feedback_msg={username_feedback}/>

               <FormElement>
                  <label htmlFor="body" className="italic pt-1 w-12/12 md:w-1/12">email</label>
                  <StyledInput 
                     name="email" 
                     value={email || ''}
                     onChanged={setEmail}
                     classes="w-11/12"
               ></StyledInput>
               </FormElement>
               <FormElementFeedback feedback_msg={email_feedback}/>

               {/* to do : reset password..  (requries confirmation?) */}
               <FormElement>
                  <label htmlFor="password" className="italic pt-1 w-12/12 md:w-1/12">reset password</label>
                  <StyledInput 
                     name="password" 
                     value={password || ''}
                     onChanged={setPassword}
                     classes="w-11/12"
                  ></StyledInput>
               </FormElement>
               <FormElementFeedback feedback_msg={password_feedback}/>
            
               <FormElement>
                  <label htmlFor="projects" className="italic pt-1 w-12/12 md:w-1/12">projects</label>
                  <StyledInput 
                     name="projects" 
                     value={projects || ''}
                     onChanged={setProjects}
                     classes="w-11/12"
                  ></StyledInput>
               </FormElement>
               <FormElementFeedback feedback_msg={projects_feedback}/>

            </section>

         </div>

         <div className="flex justify-end gap-1 my-1">
            <StyledButton aria-label="Apply." type="submit">Apply</StyledButton>

            {/* 
               to do :  first 'delete' is 'soft-delete'
                        then 'delete' changes to 'permanently delete'
            */}
            {deleted_at
               ?  <StyledButton aria-label="Delete" onClicked={props.onPermanentlyDelete}>Permanently Delete</StyledButton>
               :  <StyledButton aria-label="Delete" onClicked={props.onDelete}>Delete</StyledButton>
            }



            <StyledButton aria-label="Cancel." onClicked={props.close_modal} >Cancel</StyledButton>
         </div>
      </form>
   )
}

export default EditUserManagerForm
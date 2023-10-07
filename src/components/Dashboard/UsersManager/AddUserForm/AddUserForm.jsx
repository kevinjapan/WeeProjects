import React, { useState } from 'react'
import StyledButton from '../../../Utility/StyledButton/StyledButton'
import { validate_string,validate_email,validate_confirm_password } from '../../../Utility/Validation/uiValidation'
import FormElement from '../../../Utility/Forms/FormElement/FormElement'
import StyledInput from '../../../Utility/StyledInput/StyledInput'
import FormElementFeedback from '../../../Utility/Forms/FormElementFeedback/FormElementFeedback'


//
// Most editing of an artefact is through the UI front-end.
// Currently, this form is essentially for deletion, inputs have been set to 'readonly'.
// 


const AddUserForm = props => {

   const [username,setUsername] = useState('')
   const [user_name,setUserUnderScoreName] = useState('')
   const [email,setEmail] = useState('')
   const [password,setPassword] = useState('')
   const [password_confirmation,setPasswordConfirmation] = useState()
   const [projects,setProjects] = useState('')

   // created_at / updated_at / deleted_at

   const [username_feedback,setUsernameFeedback] = useState('')
   const [user_name_feedback,setUserUnderScoreNameFeedback] = useState('')
   const [email_feedback,setEmailFeedback] = useState('')
   const [password_feedback,setPasswordFeedback] = useState('')
   const [projects_feedback,setProjectsFeedback] = useState('')

   const handleSubmit = e => {
      
      setUsernameFeedback('')
      setEmailFeedback('')
      setPasswordFeedback('')
      setProjectsFeedback('')
      setUserUnderScoreNameFeedback('')

      e.preventDefault()
      
      const form = e.target
      const formData = new FormData(form)
      const formJson = Object.fromEntries(formData.entries());

      let validated = true

      formJson['user_name'] = formJson['user_name'].trim()
   
      if(!props.is_unique(formJson['id'],'user_name',formJson['user_name'])) {
         setUserUnderScoreNameFeedback('This username already exists, please enter a different username.')
         validated = false
      }

      if(!validate_string(formJson['user_name'],{'min_length':3,'max_length':120},setUserUnderScoreNameFeedback)) {
         validated = false
      }

      if(!validate_email(formJson['email'],{'min_length':10,'max_length':150},setEmailFeedback)) {
         validated = false
      }
      
      
      if(!validate_confirm_password(formJson['password'],formJson['password_confirmation'],setPasswordFeedback)) {
         validated = false
      }

      // future : validate projects list..  -  
      // may be null  -  (permit ',' / numbers only (or tokens?)) - rollout to EditUserForm
      if(!validate_string(formJson['projects'],{'min_length':1,'max_length':120},setProjectsFeedback)) {
         validated = false
      }
      
      if(validated) props.onSubmit(formJson)
   }


   return (
      <form onSubmit={handleSubmit}>

         <h5 className="text-2xl mb-5">Add User</h5>

         <div className="flex">

            <section className="w-2/12"></section>

            <section className="w-10/12 pl-12">

               <FormElement>
                  <label htmlFor="username" data-in="username" className="italic pt-1 w-12/12 md:w-1/12">Username</label>  
                  <StyledInput 
                     id="username"
                     name="username" 
                     value={username || ''}
                     onChanged={setUsername}
                     classes="w-11/12"
                  ></StyledInput>
               </FormElement>
               <FormElementFeedback feedback_msg={username_feedback}/>

               <FormElement>
                  <label htmlFor="user_name" className="italic pt-1 w-12/12 md:w-1/12">user name</label>
                  <StyledInput 
                     id="user_name"
                     name="user_name" 
                     value={user_name || ''}
                     placeholder="enter User Name"
                     classes="w-6/12"
                     onChanged={setUserUnderScoreName}>
                  </StyledInput>
               </FormElement>
               <FormElementFeedback feedback_msg={user_name_feedback}/>

               <FormElement>
                  <label htmlFor="body" className="italic pt-1 w-12/12 md:w-1/12">email</label>
                  <StyledInput 
                     id="email"
                     name="email" 
                     value={email || ''}
                     onChanged={setEmail}
                     classes="w-11/12"
               ></StyledInput>
               </FormElement>
               <FormElementFeedback feedback_msg={email_feedback}/>

               <FormElement>
                  <label htmlFor="projects" className="italic pt-1 w-12/12 md:w-1/12">projects</label>
                  <StyledInput 
                     id="projects"
                     name="projects" 
                     value={projects || ''}
                     onChanged={setProjects}
                     classes="w-11/12"
                  ></StyledInput>
               </FormElement>
               <FormElementFeedback feedback_msg={projects_feedback}/>

               <section className="border rounded-lg my-5 p-5">

                  <FormElement>
                     <label htmlFor="password" className="italic pt-1 w-12/12 md:w-1/12">password</label>
                     <StyledInput 
                        id="password"
                        name="password" 
                        value={password || ''}
                        onChanged={setPassword}
                        classes="w-11/12"
                     ></StyledInput>
                  </FormElement>
                  <FormElementFeedback feedback_msg={password_feedback}/>
            
                  <FormElement>
                     <label htmlFor="password_confirmation" className="italic pt-1 w-12/12 md:w-1/12">password confirmation</label>
                     <StyledInput 
                        id="password_confirmation"
                        name="password_confirmation" 
                        value={password_confirmation || ''}
                        onChanged={setPasswordConfirmation}
                        classes="w-11/12"
                     ></StyledInput>
                  </FormElement>

               </section>

            </section>

         </div>

         <div className="flex justify-end gap-1 my-1">
            <StyledButton aria-label="Apply." type="submit">Apply</StyledButton>
            <StyledButton aria-label="Delete" onClicked={props.onDelete}>Delete</StyledButton>
            <StyledButton aria-label="Cancel." onClicked={props.close_modal} >Cancel</StyledButton>
         </div>
      </form>
   )
}

export default AddUserForm
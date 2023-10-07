import React, { useState,useContext } from 'react'
import { useNavigate } from "react-router-dom"
import { AppContext } from '../../App/AppContext/AppContext'
import { Notifications } from '../../Utility/utilities/enums'
import reqInit from '../../Utility/RequestInit/RequestInit'
import FormElement from '../../Utility/Forms/FormElement/FormElement'
import FormElementFeedback from '../../Utility/Forms/FormElementFeedback/FormElementFeedback'
import StyledInput from '../../Utility/StyledInput/StyledInput'
import StyledButton from '../../Utility/StyledButton/StyledButton'
import { validate_email,validate_password } from '../../Utility/Validation/uiValidation'




const Login = props => {

   const {api,bearer_token,setBearerToken,setAppUserName,setStatusMsg} = useContext(AppContext)
   const navigate = useNavigate()
   
   const [username,setUserName] = useState('')
   const [email,setEmail] = useState('')
   const [password,setPassword] = useState('')
   const [email_feedback,setEmailFeedback] = useState('')
   const [password_feedback,setPasswordFeedback] = useState('')
   const [username_feedback,setUserNameFeedback] = useState('')


   const handleSubmit = e => {

      setEmailFeedback('')
      setPasswordFeedback('')
      setUserNameFeedback('')

      e.preventDefault()

      const form = e.target
      const formData = new FormData(form)
      const formJson = Object.fromEntries(formData.entries());

      let validated = true

      if(!validate_email(formJson['email'],{'min_length':10,'max_length':150},setEmailFeedback)) {
         validated = false
      }
      if(!validate_password(formJson['password'],setPasswordFeedback)) {
         validated = false
      }

      if(validated) {
         login_to_server(formJson)
      }
   }

   const login_to_server = async (credentials) => {
      
      try {
         //setLocalStatus(Notifications.UPDATING)
         
         const data = await fetch(`${api}/login`,reqInit("POST",bearer_token,credentials))
         const jsonData = await data.json()

         if(jsonData.outcome === Notifications.SUCCESS) {
            setBearerToken(jsonData.bearer_token)
            setAppUserName(jsonData.user_name)
            navigate('/projects')
         }
         //setLocalStatus(Notifications.DONE)         
         //setLocalStatus('')
      }
      catch(error) {
         setStatusMsg(Notifications.FAILED_SERVER_UPDATE + error)
      }
   }


   return (
      <section className="w-4/12 mx-auto">
         <form onSubmit={handleSubmit}>
            
            <h5 className="text-2xl mb-5">Login</h5>
             
            <FormElement>
               <label htmlFor="username" data-in="username" className="italic pt-1 w-12/12 md:w-6/12">User Name</label>
               <StyledInput 
                  id="username"
                  name="username" 
                  value={username || ''}
                  placeholder="enter User Name"
                  classes="w-6/12"
                  onChanged={setUserName}>
               </StyledInput>
            </FormElement>
            <FormElementFeedback feedback_msg={username_feedback}/>

            <FormElement>
               <label htmlFor="email" className="italic pt-1 w-12/12 md:w-6/12">email</label>
               <StyledInput 
                  id="email"
                  name="email" 
                  value={email || ''}
                  placeholder="enter email"
                  classes="w-6/12"
                  onChanged={setEmail}
                  autocomplete="email">
               </StyledInput>
            </FormElement>
            <FormElementFeedback feedback_msg={email_feedback}/>

            <FormElement>
               <label htmlFor="password" className="italic pt-1 w-12/12 md:w-6/12">password</label>
               <StyledInput 
                  id="password"
                  name="password" 
                  value={password || ''}
                  placeholder="enter password"
                  classes="w-6/12"
                  onChanged={setPassword}
                  autocomplete="off">
               </StyledInput>
            </FormElement>
            <FormElementFeedback feedback_msg={password_feedback}/>

            <div className="flex justify-end gap-1 my-1">
               <StyledButton aria-label="Apply." type="submit">Login</StyledButton>
            </div>

         </form>
      </section>
   )
}

export default Login
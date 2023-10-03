import React, { useState,useContext } from 'react'
import { useNavigate } from "react-router-dom"
import { AppContext } from '../../App/AppContext/AppContext'
import { Notifications } from '../../Utility/utilities/enums'
import reqInit from '../../Utility/RequestInit/RequestInit'
import FormElement from '../../Utility/Forms/FormElement/FormElement'
import FormElementFeedback from '../../Utility/Forms/FormElementFeedback/FormElementFeedback'
import StyledInput from '../../Utility/StyledInput/StyledInput'
import StyledButton from '../../Utility/StyledButton/StyledButton'
import { validate_int, validate_string } from '../../Utility/Validation/uiValidation'



const Login = props => {

   const {api,bearer_token,setBearerToken,user_name,setUserName,setStatusMsg} = useContext(AppContext)
   const navigate = useNavigate()
   
   const [email,setEmail] = useState('')
   const [password,setPassword] = useState('')
   const [email_feedback,setEmailFeedback] = useState('')         // to do : prob. don't want to provide indvdl feedback on this form
   const [password_feedback,setPasswordFeedback] = useState('')
   const [user_name_feedback,setUserNameFeedback] = useState('')


   const handleSubmit = e => {

      setEmailFeedback('')
      setPasswordFeedback('')
      setUserNameFeedback('')

      e.preventDefault()

      const form = e.target
      const formData = new FormData(form)
      const formJson = Object.fromEntries(formData.entries());

      let validated = true

      // to do : configure the following validations..

      // to do : re-enable (disabled to fully test server responses..)
      // if(!validate_string(formJson['email'],{'min_length':10,'max_length':80},setEmailFeedback)) {
      //    validated = false
      // }

      // if(!validate_string(formJson['password'],{'min_length':10,'max_length':80},setPasswordFeedback)) {     // to do : provide a single generic feedback?
      //    validated = false
      // }

      if(validated) {
         login_to_server(formJson)
      }
   }

   const login_to_server = async (credentials) => {
      
      // to do : csrf / nonce on all forms/requests.

      try {
         //setLocalStatus(Notifications.UPDATING)
         
         const data = await fetch(`${api}/login`,reqInit("POST",bearer_token,credentials))
         const jsonData = await data.json()

         if(jsonData.outcome === Notifications.SUCCESS) {

            // to do : in first instance, we will rely on server side authentication -
            //         so client-side:
            //         - do login
            //         - store a stub token for now
            //         - we can use presence of this stub for some client-side decisions
            //           but it has no authentication purpose yet.
            //           future - we will return it each time as a secondary validation -
            //                    where server will validate it (perhaps replacing session?)
            //           but authentication will be by server-side php sessions for now.
            //
            // setUsername(jsonData.user.name)
            setBearerToken(jsonData.bearer_token)
            setUserName(jsonData.user_name)

            navigate('/projects')
         }

         //setLocalStatus(Notifications.DONE)
         await new Promise(resolve => setTimeout(resolve, 1000))
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
            
			   <input name="user_name" type="text" id="user_name"></input>

            {/* to do : how to 'hide' cleanly (w/out detection) */}
            
            {/* to do : database.user does have a username field - need a separate honeypot field here... */}
            <FormElement>
               <label htmlFor="user_name" className="italic pt-1 w-12/12 md:w-6/12">User Name</label>
               <StyledInput 
                  name="user_name" 
                  value={user_name || ''}
                  placeholder="enter User Name"
                  classes="w-6/12"
                  onChanged={setUserName}>
               </StyledInput>
            </FormElement>
            <FormElementFeedback feedback_msg={user_name_feedback}/>

            <FormElement>
               <label htmlFor="email" className="italic pt-1 w-12/12 md:w-6/12">email</label>
               <StyledInput 
                  name="email" 
                  value={email || ''}
                  placeholder="enter email"
                  classes="w-6/12"
                  onChanged={setEmail}>
               </StyledInput>
            </FormElement>
            <FormElementFeedback feedback_msg={email_feedback}/>

            <FormElement>
               <label htmlFor="password" className="italic pt-1 w-12/12 md:w-6/12">password</label>
               <StyledInput 
                  name="password" 
                  value={password || ''}
                  placeholder="enter password"
                  classes="w-6/12"
                  onChanged={setPassword}>
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
import React, { useEffect,useContext } from 'react'
import { AppContext } from '../../App/AppContext/AppContext'




const Logout = props => {

   const {api,bearer_token,setBearerToken,setAppUserName} = useContext(AppContext)

   useEffect(() => {
      setBearerToken('')
      setAppUserName('')
   },[])


   // 
   // future : housekeeping - notify server to tidy any tokens saved or such..
   // currently, we just discard bearer_token 
   //



   return (
      <section  className="w-4/12 mx-auto mt-20">
         <p className="text-lg">You have successfully logged out.</p>
      </section>
   )
}

export default Logout
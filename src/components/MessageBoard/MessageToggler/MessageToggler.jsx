import React from 'react'
import { Link } from 'react-router-dom'


const MessageToggler = props => {

   return (
      <section className="float-right">
         {props.is_open 
            ?  <Link 
                  onClick={() => props.toggle(false)}
               >close
               </Link>
            :  <Link
                  onClick={() => props.toggle(true)}
               >open
               </Link>
         }
      </section>
   )
}


export default MessageToggler
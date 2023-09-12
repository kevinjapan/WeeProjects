import React from 'react'
import get_ui_ready_date from '../../../Utility/DateTime/DateTime'
import { is_valid_today_session } from '../../../Utility/Sessions/Sessions'
import StyledButton from '../../../Utility/StyledButton/StyledButton'


//
// SessionsManagerListItem
// Sessions never extend beyond a single day
//

const SessionsManagerListItem = props => {

   return (
      <li className={`grid grid-cols-4 items-center border rounded m-1 px-1`}>

         <div>{get_ui_ready_date(props.session.started_at)}</div>

         <div>{props.session.duration} hrs</div> 

         <div>{props.session.start_time}-{props.session.end_time}</div>

         <div className="flex">
            <StyledButton  aria-label="Edit.">
               <div onClick={() => props.edit_session(props.session.id)}>edit</div>
            </StyledButton>
      
            {/* 'end now' is a convenience for ending the current open sesssion.*/}
            {
               !props.session.end_time && is_valid_today_session(props.session.started_at)
                  ?  <StyledButton  aria-label="Edit.">
                        <div className="italic" onClick={() => props.end_session(props.session.id)}>end now</div>
                     </StyledButton>
                  :  null
            }
         </div>

      </li>
   )
}

export default SessionsManagerListItem
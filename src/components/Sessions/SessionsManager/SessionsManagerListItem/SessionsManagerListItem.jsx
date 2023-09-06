import React from 'react'
import get_ui_ready_date from '../../../Utility/DateTime/DateTime'
import StyledButton from '../../../Utility/StyledButton/StyledButton'


//
// SessionsManagerListItem
//
// Sessions never extend beyond a single day
// note : props.sessions will contain *all* sessions - including those w/ 'offset: null' - that's good!
//

const SessionsManagerListItem = props => {

   return (
      <li className={`grid grid-cols-4 items-center border rounded m-1 px-1`}>
         <div>{get_ui_ready_date(props.session.started_at)}</div>
         <div>{props.session.duration} hrs</div> 
         <div>{props.session.start_time}-{props.session.end_time}</div>
         <StyledButton  aria-label="Edit.">
            <div onClick={() => props.edit_session(props.session.id)}>edit</div>
         </StyledButton>
      </li>
   )
}

export default SessionsManagerListItem
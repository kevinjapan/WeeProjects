import React, { useState,useEffect } from 'react'
import get_ui_ready_date from '../../Utility/DateTime/DateTime'


//
// SessionManagerListItem
// Display only - any calcs, in parent SessionManager
// Sessions never extend beyond a single day
// note : props.sessions will contain *all* sessions - including those w/ 'offset: null' - that's good!
//

const SessionManagerListItem = props => {

   // we store as dates, although only time differs, to access existing Date methods
   const [start_datetime,setStartDateTime] = useState(null)
   
   // end_ - we assume always same date - we are only interested in the time
   // if not set, will exist as 'null' - any clients (eg 'get_ui_ready_date') should allow for this
   const [end_datetime,setEndDateTime] = useState(null)
   
   const [duration,setDuration] = useState(0)
   const [start_time,setStartTime] = useState(0)
   const [end_time,setEndTime] = useState(0)

   useEffect(() => {
      // to do : still required?
      setStartDateTime(props.session.started_at)
      setEndDateTime(props.session.ended_at)

      setDuration(props.session.duration)
      setStartTime(props.session.start_time)
      setEndTime(props.session.end_time)
   },[props.session])

   return (
      <li className={`grid grid-cols-4 border rounded m-1`}>
         <div>{get_ui_ready_date(props.session.started_at)}</div>
         <div>{duration} hrs</div> 
         <div>{start_time}-{end_time}</div>
      </li>
   )
}

export default SessionManagerListItem
import React, { useState,useEffect } from 'react'
import get_ui_ready_date from '../../Utility/DateTime/DateTime'

//
// SessionManagerListItem
// Sessions never extend beyond a single day
// note : props.sessions will contain *all* sessions - including those w/ 'offset: null' - that's good!

// to do : 
// - calc duration (approx is ok - eg to nearest .5 hr)


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
      <li className={`border rounded m-1`}>
         <span style={{fontSize:'.75rem',color:'lightgrey'}}>{get_ui_ready_date(props.session.started_at)}</span>

         <div>duration: {duration}</div>
         <span>{start_time}</span> - <span>{end_time}</span>
      </li>
   )
}

export default SessionManagerListItem
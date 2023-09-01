import React, { useState,useEffect } from 'react'
import SessionManagerListItem from '../SessionManagerListItem/SessionManagerListItem'
import { get_ui_ready_time } from '../../Utility/DateTime/DateTime'


//
// SessionManager
//
// Sessions rcvd from parent are simple json/string representations of dates -
// {id: 19, author_id: 1, started_at: '2023-08-28 12:07:20', ended_at: '2023-08-28 15:47:20', offset: 169}
// note : props.sessions will contain *all* sessions - including those w/ 'offset: null' - that's good!
// - we assume duplicates (on same day) are separate entries 

// to do :
// - add end_time (stop a current open session)
// - edit session
// - delete session
// - currently doesn't show up to current day - 
//   we are starting on nearest sunday which may add no.s beyond size of grid array..
// - SessionManager panel is not updating on 'add a session'
// - don't allow add a new session if one already open today?
//


const SessionManager = props => {

   const [hydrated_sessions,setHydratedSessions] = useState(props.sessions)
   const [total_duration,setTotalDuration] = useState(0)
   const [number_sessions,setNumberSessions] = useState(0)

   useEffect(() => {

      console.log('rcvd props.sessions ',props.sessions) // checked - we are def. getting an array here..

      // to do : review this - we still appear to be modifying original array? we only want to insert into a copy here.. review console.logs
      let modified_sessions = [...props.sessions]

      // calc & insert duration for each session
      modified_sessions.forEach(session => {

         const started_datetime = new Date(session.started_at)
         console.log('Y ',session.ended_at)
         const ended_datetime = session.ended_at ? new Date(session.ended_at) : null

         let start_datetime = started_datetime.getTime()
         let end_datetime = ended_datetime ? ended_datetime.getTime() : null

         let duration = Math.round((((end_datetime - start_datetime) / 1000) / 60) / 60)

         // add new properties
         session['duration'] = duration > 0 ? duration : 0
         session['start_time'] = get_ui_ready_time(started_datetime)
         session['end_time'] = get_ui_ready_time(ended_datetime)

         console.log('modified_sessions ',modified_sessions)
      })

      const total_hours = modified_sessions.reduce((current_total,item) => {
         return item.duration + current_total
      },0)

      setHydratedSessions(modified_sessions)
      setTotalDuration(total_hours)
      setNumberSessions(modified_sessions.length)

   },[props.sessions])

   return (
      <section className="border border-gray-300 rounded p-2 text-slate-500">
         <h5>Sessions</h5>
         {number_sessions} sessions / 
         total time: {total_duration} hours
         <ul className="">
            {hydrated_sessions.map((session,index) => (
               <SessionManagerListItem 
                  key={index}
                  session={session} 
               />
            ))}
         </ul>
      </section>
   )
}

export default SessionManager
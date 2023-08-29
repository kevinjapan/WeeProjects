import React, { useState,useEffect } from 'react'
import { get_day,get_month,extract_db_date_month } from '../../Utility/Dates/Dates'



// CalendarGrid
// We calculate the offset of each session from the given start_date,
// and then insert sessions into the grid array at offset index position.


// to do : 
// - align 'month' labels
// - mouseover - tooltip details for session? 
// - deal w/ user not ending a session
// - verify 'props.num_days' is valid.



const CalendarGrid = props => {

   const [grid,setGrid] = useState(Array(props.num_days + 2).fill(0))

   useEffect(() => {
   
      // calc offset of each session from 0 index date in the grid - 'start_date'
      let temp_date = null

      // calc grid offset for each session 
      if(props.sessions) {
         props.sessions.forEach(session => {

            // to do : try alternative of re-assigning date to same Date object here... quicker? (scope new Date outside this loop)
            temp_date = new Date(session.started_at)         

            // add grid offset to the Session - excluding Sessions before start_date
            let offset = Math.round((temp_date - props.start_date ) / (1000 * 3600 * 24))
            session.offset = offset > 0 ? offset : null
         })

         // insert sessions into grid array
         let modified = grid
         props.sessions.forEach(session => {
            if(session.offset) {
               modified[session.offset] = session

            }
         })
         setGrid(modified)
      }
   },[props.session])


   const month_labels = (start_date) => {

      // we maintain grid alignment by using same <li> dimensions

      // to do : calc spacing - calc index of array to insert label into..
      //  since cells in the grid don't know their corresponding date, we can't check against them..
      //  so try stepping backwards from known today's date (and it's position in current month) (or forwards from start_date?)
  
      let month_label_key = 0
      let grid_months_labels =  Array(6)

      const start_month_index = start_date.getMonth()
      for(let i = start_month_index ; i < start_month_index + 6; i++) {
         grid_months_labels[i] = get_month(i,1)
      }

      return (
         <ul className="grid grid-flow-col text-xs text-gray-900">
            <li key={month_label_key++} className="bg-blue-100 w-4 h-4 m-px "></li>
            {grid_months_labels.map((label) => (
               <React.Fragment key={month_label_key++}>
                  <li key={month_label_key++} className="bg-blue-100 w-4 h-4 m-px ">{label}</li>
                  <li key={month_label_key++} className="bg-blue-100 w-4 h-4 m-px "></li>
                  <li key={month_label_key++} className="bg-blue-100 w-4 h-4 m-px "></li>
                  <li key={month_label_key++} className="bg-blue-100 w-4 h-4 m-px "></li>
               </React.Fragment>
            ))}
            <li key={month_label_key++} className="bg-blue-100 w-4 h-4 m-px "></li>
         </ul>
      )
   }

   const day_labels = () => {
      let day_label_key = 0
      return (
         <React.Fragment key={day_label_key++}>
            <li key={day_label_key++} className=" w-4 h-4 rounded">s</li>
            <li key={day_label_key++} className=" w-4 h-4 rounded">m</li>
            <li key={day_label_key++} className=" w-4 h-4 rounded">t</li>
            <li key={day_label_key++} className=" w-4 h-4 rounded">w</li>
            <li key={day_label_key++} className=" w-4 h-4 rounded">t</li>
            <li key={day_label_key++} className=" w-4 h-4 rounded">f</li>
            <li key={day_label_key++} className=" w-4 h-4 rounded">s</li>
         </React.Fragment>
      )
   }

   // we inc. 'grid-template-rows' inline - tailwind's max is 'grid-rows-6'
   return (
      <>
         {month_labels(props.start_date)}
         <ul className="grid grid-flow-col text-xs text-gray-400 text-center" style={{gridTemplateRows:'repeat(7,1fr)'}}>
            {day_labels()}
            {grid.map((slot,index) => (
               <li key={index} className={`m-px w-4 h-4 rounded ${slot.id ? ' bg-gray-300 ' : ' bg-gray-100 '}`}>
                  {slot.started_at ? extract_db_date_month(slot.started_at) : ''}
               </li>
            ))}
         </ul>
      </>
   )
}

export default CalendarGrid
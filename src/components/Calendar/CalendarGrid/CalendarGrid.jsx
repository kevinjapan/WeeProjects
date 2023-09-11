import React, { useState,useEffect } from 'react'
import { get_month,extract_db_date_month } from '../../Utility/DateTime/DateTime'



// CalendarGrid
// We calculate the offset of each session from the given start_date,
// and then insert sessions into the grid array at offset index position.


const CalendarGrid = props => {
 
   // We know we will have 24 x 7 columns => 168
   // but we need to show those cols + days in current week -
   // so we add 'num_days_this_week' elements to grid array.

   const today = new Date()
   let num_days_this_week = today.getDay() + 1 

   const [grid,setGrid] = useState(Array(props.num_days + num_days_this_week).fill(0))

   useEffect(() => {
   
      // calc offset of each session from 0 index date in the grid - 'start_date'
      let temp_date = null

      // calc grid offset for each session 
      if(props.sessions) {
         props.sessions.forEach(session => {

            // future : try alternative of re-assigning date to same Date object here... (scope new Date() outside this loop)
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
   },[props.sessions])

   const number_of_days = (year,month) => {
      // passing 0 for day returns the previous day - so last day of previous month - hence, increment month
      return new Date(year, month + 1, 0).getDate()
   }

   const days_remaining = (start_date,current_month_day_count) => {
      // calc no. of days remaining in this month
      return current_month_day_count - start_date.getDate()
   }


   // 
   // month_labels
   // future - there is a slight mis-alignment - possible cumulative - but good enough
   //
   const month_labels = (start_date) => {

      // array aligns labels w/ calendar grid
      let grid_months_slots = Array(24).fill('')

      // initialize
      let year = start_date.getFullYear()
      let month_index = start_date.getMonth()
      let current_month_day_count = number_of_days(2023,month_index)
      let inject_at = 0
      let num_days_remaining = days_remaining(start_date,current_month_day_count)

      // show first month label if we have col space
      if(num_days_remaining > 14) {
         grid_months_slots[inject_at] = get_month(start_date.getMonth())
      }

      // step through successive months
      for(let count = 1; count <= 6;count++) {

         // calc next label insertion index as no. of weeks (columns) remaing in current month
         inject_at = inject_at + Math.round(num_days_remaining / 7)
         month_index++
         grid_months_slots[inject_at] = get_month(month_index)

         // days in this month
         num_days_remaining = number_of_days(year,month_index)

         // handle cross-over into a new year
         if(month_index >= 11) {
            month_index = -1 // resets to zero on above increment
            year++
         }
      }

      let unique_key = 0

      return (
         <ul className="grid grid-flow-col text-xs text-gray-900">
            <li key={unique_key++} className=" w-4 h-4 m-px "></li>
            {grid_months_slots.map((label) => (
               <React.Fragment key={unique_key++}>
                  <li key={unique_key++} className=" w-4 h-4 m-px ">{label}</li>
               </React.Fragment>
            ))}
            <li key={unique_key++} className=" w-4 h-4 m-px "></li>
         </ul>
      )
   }


   const day_labels = () => {
      let unique_key = 0
      return (
         <React.Fragment key={unique_key++}>
            <li key={unique_key++} className=" w-4 h-4 m-px rounded">s</li>
            <li key={unique_key++} className=" w-4 h-4 m-px rounded">m</li>
            <li key={unique_key++} className=" w-4 h-4 m-px rounded">t</li>
            <li key={unique_key++} className=" w-4 h-4 m-px rounded">w</li>
            <li key={unique_key++} className=" w-4 h-4 m-px rounded">t</li>
            <li key={unique_key++} className=" w-4 h-4 m-px rounded">f</li>
            <li key={unique_key++} className=" w-4 h-4 m-px rounded">s</li>
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
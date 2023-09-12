import React, { useState,useEffect } from 'react'
import get_ui_ready_date, { add_days,get_month,extract_db_date_month,days_elapsed_this_week } from '../../Utility/DateTime/DateTime'



// CalendarGrid
// We calculate the offset of each session from the given start_date,
// and then insert sessions into the grid array at offset index position.


const CalendarGrid = props => {
  
   const [start_date,setStartDate] = useState(new Date(props.start_date))

   // We know we will have approx 24 x 7 columns => 168, but we need to accomodate position in current week -
   // so we add 'days_elapsed_this_week' elements to grid array.
   const [grid,setGrid] = useState(Array(props.num_days + days_elapsed_this_week()).fill(0))

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
         setGrid([...modified])
      }

      setStartDate(props.start_date)

   },[props.sessions,props.start_date])

   


   const number_of_days = (year,month) => {
      // passing 0 for day returns the previous day - so last day of previous month - hence, increment month
      return new Date(year, month + 1, 0).getDate()
   }

   const days_remaining = (start_date,current_month_day_count) => {
      // calc no. of days remaining in this month
      return current_month_day_count - start_date.getDate()
   }

   const get_duration = slot => {

      const started_datetime = new Date(slot.started_at)
      const ended_datetime = slot.ended_at ? new Date(slot.ended_at) : null

      if(ended_datetime) {
         // future : validate times
         let start_datetime = started_datetime.getTime()
         let end_datetime = ended_datetime ? ended_datetime.getTime() : null

         return Math.round((((end_datetime - start_datetime) / 1000) / 60) / 60)
      }
      return 0
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

   // we calc slot date on the fly for tooltips since slots don't hold their own dates
   const slot_date = slot_index => {
      let slot_date = add_days(start_date,slot_index)
      return get_ui_ready_date(slot_date)
   }


   // we inc. 'grid-template-rows' inline - tailwind's max is 'grid-rows-6'
   return (
      <>
         {month_labels(props.start_date)}
         <ul className="grid grid-flow-col text-xs text-gray-400 text-center" style={{gridTemplateRows:'repeat(7,1fr)'}}>
            {day_labels()}
            {grid.map((slot,index) => (
               <li key={index} className={`m-px w-4 h-4 rounded ${slot.id ? ' bg-gray-300 ' : ' bg-gray-200 '} tooltipped`}>
                  {slot.started_at ? extract_db_date_month(slot.started_at) : ''}
                  <span className="tooltip">{get_duration(slot)} hours on {slot_date(index)}</span>
               </li>
            ))}
         </ul>
      </>
   )
}

export default CalendarGrid
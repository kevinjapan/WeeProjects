import React from 'react'
import CalendarGrid from './CalendarGrid/CalendarGrid'
import { add_days } from '../Utility/DateTime/DateTime'



const Calendar = props => {

   const num_days = 168    // c.6 months

   // get date of Sunday of the current week
   let current_week_start_date = new Date()
   current_week_start_date.setDate(current_week_start_date.getDate() - current_week_start_date.getDay())

   // subtract num_days to get date of Sunday of the grid start week (assumes -num_days is always taking us back to a Sunday)
   let grid_start_date = add_days(current_week_start_date,parseInt(-num_days))

   return (
      <CalendarGrid start_date={grid_start_date} num_days={num_days} sessions={props.sessions} />
   )
}

export default Calendar
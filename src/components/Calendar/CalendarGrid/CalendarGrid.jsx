import React from 'react'


// CalendarGrid
// We calculate the offset of each session from the given start_date,
// and then insert sessions into the grid array at offset index position.


// to do : 
// - mouseover - tooltip details for session? 
// - deal w/ user not ending a session


const CalendarGrid = props => {

   // to do : verify 'props.num_days' is valid.

   const grid = Array(props.num_days + 2).fill(0)     // to do : tidy displaying days up to and including today..
   let key_value = 0

   console.log('calendar grid start date: ' , props.start_date)

   const init_grid_array = () => {

      // calc offset of each session from 0 index date in the grid - 'start_date'
      let temp_date = null

      // calc grid offset for each session 
      props.sessions.forEach(session => {

         // to do : try alternative of just re-assigning date to same Date object here... quicker? (scope new Date outside this loop)
         temp_date = new Date(session.started_at)         

         // add grid offset to the Session - excluding dates before start_date
         let offset = Math.round((temp_date - props.start_date ) / (1000 * 3600 * 24))
         session.offset = offset > 0 ? offset : null
      })

      // insert sessions into grid array
      props.sessions.forEach(session => {
         if(session.offset) {
            grid[session.offset] = session
         }
      })
   }

   init_grid_array()

   // we inc. 'grid-template-rows' - tailwind's max is 'grid-rows-6'

   return (
      <ul className="grid grid-flow-col " style={{gridTemplateRows:'repeat(7,1fr)'}}>
         {grid.map((slot) => (
            <li 
               key={key_value++} 
               className={`m-px w-4 h-4 rounded ${slot.id ? ' bg-gray-200 ' : ' bg-gray-100 '}`}
               ></li>
         ))}
      </ul>
   )
}

export default CalendarGrid
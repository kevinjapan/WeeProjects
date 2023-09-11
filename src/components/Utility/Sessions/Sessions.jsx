


//
//    Was the session started today?
//
export const is_valid_today_session = started_at => {
   
   const session_date = new Date(started_at)
   const today = new Date() 
   
   if(session_date.getDate() === today.getDate() && 
      session_date.getMonth() === today.getMonth() && 
      session_date.getFullYear() === today.getFullYear()) {
      return true
   }
   return false
}

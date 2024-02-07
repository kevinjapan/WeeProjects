import truncate from '../Stringer/uiStringer'


//
//  Display on UI - '16 Mar 2023'
//
export default function get_ui_ready_date (d,inc_day = false) {

   if(d === undefined || d === null) return ''

   let ui_updated = new Date(d)

   const months = {0:'Jan',1:'Feb',2:'Mar',3:'Apr',4:'May',5:'Jun',6:'Jul',7:'Aug',8:'Sep',9:'Oct',10:'Nov',11:'Dec'}

   return get_day(ui_updated.getDay()) + " " + ui_updated.getDate() + " " + months[ui_updated.getMonth()] + " " + ui_updated.getFullYear()
}

//
//  Display on UI - '11:35:25'
//
export const get_ui_ready_time = (d,inc_secs = false) => {

   if(d === undefined || d === null) return ''

   let the_date = new Date(d)

   let time_part = the_date.getHours() + ':'

   // prepend with '0' as required
   time_part += parseInt(the_date.getMinutes()) < 10 ? '0' + the_date.getMinutes() : the_date.getMinutes()
   
   if(inc_secs) {
      time_part += ':' + the_date.getSeconds()
   }
   return time_part
}


//
//  Format for database storage - '2023-03-09 12:55:55'
//
export const get_db_ready_datetime = (d) => {
    if(d === undefined) return null
    let date_part = d.getFullYear() + '-' + parseInt(d.getMonth() + 1) + '-' + d.getDate() 
    let time_part = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
    return date_part + ' ' + time_part
}


// 
// Get day by index - days are 0 indexed
//
export const get_day = (days_index,num_chars = 3) => {
   const days = [
      "Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"
   ]
   return truncate(days[days_index],num_chars,false)
}


// 
// Get month by index - months are 0 indexed
//
export const get_month = (month_index,num_chars = 3) => {
   const months = [
      "January","February","March","April","May","June","July","August","September","October","November","December"
   ]
   return truncate( months[month_index], num_chars, false )
}


//
// Extract month from db date - eg '2023-04-22 12:07:24'
//
export const extract_db_date_month = (date_string) => {
   if(date_string !== "" && date_string) {
      let parts = date_string.split(' ')
      if(parts) {
         let date_parts = parts[0].split('-')
         return date_parts[1]
      }
   }
}

//
// Extract time from db date - eg '2023-04-22 12:07:24'
//
export const extract_db_date_time = (date_string) => {
   if(date_string !== "" && date_string) {
      let parts = date_string.split(' ')
      if(parts) {
         return parts[1]
      }
   }
}


//
//  Insert timestamp into json 
//
export const datetimestamp = () => {
 
    // - we should save on server as UTC datetime
    // - server should convert and save all as UTC datetime
    // - client should provide local timezone code for server to convert
    // - server converts for display to client? or client converts on-the-fly itself?
    const d = new Date()
    return get_db_ready_datetime(d)
}


//
// add_days - return a new Date object with added 'days'
//
export const add_days = (date,days) => {
   
   return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + days,
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
   )
}

//
// number of days elapsed this week so far..
//
export const days_elapsed_this_week = () => {
   const today = new Date()
   return today.getDay() + 1
}

//
// delay execution - max 60 seconds
//
export const wait_for = (secs) => {

   if(secs < 0) return
   secs = secs * 1000
   if(parseInt(secs) > 60000) secs = 60000

   let datetime1 = new Date().getTime()
   let datetime2 = datetime1 + parseInt(secs)
   while(datetime1 < datetime2) {
      datetime1 = new Date().getTime()
   }

}
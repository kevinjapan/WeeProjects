


const days = ["Sun","Mon","Tues","Wed","Thu","Fri","Sat"]
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"]


//
//  display on UI - '16 Mar 2023'
//
export default function get_ui_ready_date (d) {
    if(d === undefined) return null
    let ui_updated = new Date(d)
    const months = {0:'Jan',1:'Feb',2:'Mar',3:'Apr',4:'May',5:'Jun',6:'Jul',7:'Aug',8:'Sep',9:'Oct',10:'Nov',11:'Dec'}
    return ui_updated.getDate() + " " + months[ui_updated.getMonth()] + " " + ui_updated.getFullYear()
}

//
//  format for database storage - '2023-03-09 12:55:55'
//
export const get_db_ready_datetime = (d) => {
    if(d === undefined) return null
    let date_part = d.getFullYear() + '-' + parseInt(d.getMonth() + 1) + '-' + d.getDate() 
    let time_part = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
    return date_part + ' ' + time_part
}

//
//  insert timestamp into json 
//
export const datetimestamp = () => {
 
    // - we should save on server as UTC datetime
    // - server should convert and save all as UTC datetime
    // - client should provide local timezone code for server to convert
    // - server converts for display to client? or client converts on-the-fly itself?
    var d = new Date()
    return get_db_ready_datetime(d)
}


//
// add_days 
// Return a new Date object with added 'days'
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
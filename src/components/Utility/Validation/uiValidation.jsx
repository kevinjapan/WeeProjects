import { LENGTHS as LEN } from '../../Utility/utilities/enums'


//
// String
//
export const validate_string = (str,tests,set_msg_callback,required=true) => {

   if(required && ((!str) || (str.length === 0))) {
      set_msg_callback('This field is required.')
      return false
   }

   // perform client-configured tests
   if(tests['min_length']) {
      if(str.length < tests['min_length']) {
         set_msg_callback('The entered value is too short.')
         return false
      }
   }
   if(tests['max_length']) {
      if(str.length > tests['max_length']) {
         set_msg_callback('The entered value is too long (' + str.length + '/' + tests['max_length'] + ')')
         return false
      }
   }
   return true
}


//
// Integer
//
export const validate_int = (value,tests,set_msg_callback) => {

    if((!value) || (isNaN(value))) {
        set_msg_callback('This must be a number.')
        return false
    }
    
    // perform client-configured tests
    if(tests['min_value']) {
        if(value < tests['min_value']) {
            set_msg_callback('below min permitted value')
            return false
        }
    }
    if(tests['max_value']) {
        if(value > tests['max_value']) {
            set_msg_callback('above max permitted value')
            return false
        }
    }
    return true
}


//
// DateTime String
// expects eg '2023-09-02 12:27:20'
//
export const validate_datetime_string = (value,tests,set_msg_callback) => {

   const dateObject = new Date(value)
   if(dateObject.toString() === 'Invalid Date') {
      set_msg_callback('invalid datetime')
      return false
   }
   return true
}


// 
// Password
// validate with confirmation password
//
export const validate_confirm_password = (password,password_confirmation,tests,set_msg_callback,required=true) => {
   if(password !== password_confirmation) {
      set_msg_callback('The password and password confirmation must match.')
      return false;
   }
   return validate_password(password,tests,set_msg_callback,required)
}


// 
// Password
// we set 'tests' here in a single place
//
export const validate_password = (password,tests,set_msg_callback,required=true) => {
   
   // test for key - not value - since 0 would be falsey
   let min_len = Object.hasOwn(tests,'min_length') ? tests['min_length'] : LEN.PASSWORD_MIN;
   let max_len = Object.hasOwn(tests,'max_length') ? tests['max_length'] : LEN.PASSWORD_MAX;
   
   if(required && ((!password) || (password.length < min_len))) {
      set_msg_callback('This field is required.')
      return false
   }

   if(password.length < min_len) {
      set_msg_callback('The entered value is too short. ' + min_len)
      return false
   }
   if(password.length > max_len) {
      set_msg_callback('The entered value is too long (' + password.length + '/' + max_len + ')')
      return false
   }

   // to do : what char combination is required in our password ?

   return true
}


//
// Email
// to do : adapt following from copied validate_string
//
export const validate_email = (str,tests,set_msg_callback,required=true) => {

   if(required && ((!str) || (str.length === 0))) {
      set_msg_callback('This field is required.')
      return false
   }

   // perform client-configured tests
   if(tests['min_length']) {
      if(str.length < tests['min_length']) {
         set_msg_callback('The entered value is too short.')
         return false
      }
   }
   if(tests['max_length']) {
      if(str.length > tests['max_length']) {
         set_msg_callback('The entered value is too long (' + str.length + '/' + tests['max_length'] + ')')
         return false
      }
   }
   return true
}


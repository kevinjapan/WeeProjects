

export const validate_string = (str,tests,set_msg_callback) => {

    if((!str) || (str.length === 0)) {
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
            set_msg_callback('The entered value is too long.')
            return false
        }
    }
    return true
}


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

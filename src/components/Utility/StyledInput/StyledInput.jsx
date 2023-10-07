import React from 'react'

// note 
// we need 'id' for input elements to support browser autofill and accessibility
// we default to using 'name' if 'id' is not provided.
//



const StyledInput = props => {

   let classes = "grow border border-slate-300 rounded focus:outline p-1 w-full leading-3"

   // client may provide additional / override styling
   if(props.classes) classes += " " + props.classes


   let readonly = props.readonly ? true : false
   

   const on_change = (e) => {

      // we exclude chars not URI friendly eg '/' (use g since user could paste.)
      let valid_string = e.target.value.replace(/[^a-z0-9\-\? \'\:\;]/gi, '')
  
      if(props.onChanged) {
         props.onChanged(valid_string)
      }
   }

   // to do :  An element doesn't have an AutoComplete attribute.
   // we have issue for improvement - see 'issues' tab on dev tools while visiting form pages.. eg login.
   // https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#values

   return (
      props.onChanged ?  
         <input 
            id={props.id || props.name}
            name={props.name} 
            value={props.value || ''}  
            className={classes}
            onChange={e => on_change(e)} readOnly={readonly} />
      :  <input 
            id={props.id || props.name}
            name={props.name} 
            defaultValue={props.value || ''}  
            className={classes}
            onChange={e => on_change(e)} readOnly={readonly} />
   )
}

export default StyledInput
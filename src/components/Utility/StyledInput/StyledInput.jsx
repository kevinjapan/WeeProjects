import React from 'react'


const StyledInput = props => {

   let classes = "grow border border-slate-300 rounded focus:outline p-1 w-full leading-3"

   // client may provide additional / override styling
   if(props.classes) classes += " " + props.classes

   const on_change = (e) => {

      // we exclude chars not URI friendly eg '/' (use g since user could paste.)
      let valid_string = e.target.value.replace(/[^a-z0-9\-\? \'\:\;]/gi, '')
  
      if(props.onChanged) {
         props.onChanged(valid_string)
      }
   }

   return (
      props.onChanged ?  
         <input 
            name={props.name} 
            value={props.value || ''}  
            className={classes}
            onChange={e => on_change(e)}/>
      :  <input 
            name={props.name} 
            defaultValue={props.value || ''}  
            className={classes}
            onChange={e => on_change(e)} />
   )
}

export default StyledInput
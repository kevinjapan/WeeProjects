import React from 'react'


// note 
// we need 'id' for input elements to support browser autofill and accessibility
// we default to using 'name' if 'id' is not provided.
//


const StyledTextArea = props => {

   let classes = "grow border border-slate-300 rounded leading-5 focus:outline p-2 leading-3 h-36 max-h-72   min-h-[160px] "

   // client may provide additional / override styling
   if(props.classes) classes += " " + props.classes
    
   let readonly = props.readonly ? true : false

   return (
      props.onChanged
         ?  <textarea 
               id={props.id || props.name}
               name={props.name} 
               value={props.value || ''}  
               className={classes}
               onChange={e => props.onChanged(e.target.value)} 
               readOnly={readonly} />
         :  <textarea 
               id={props.id || props.name}
               name={props.name} 
               defaultValue={props.value || ''}  
               className={classes}  
               readOnly={readonly} />
   )
}

export default StyledTextArea
import React from 'react'


const StyledTextArea = props => {

   let classes = "grow border border-slate-300 rounded leading-5 focus:outline p-2 leading-3 h-36 max-h-72   min-h-[160px] "

   // client may provide additional / override styling
   if(props.classes) classes += " " + props.classes
    
   return (
      props.onChanged
         ?  <textarea 
               name={props.name} 
               value={props.value || ''}  
               className={classes}
               onChange={e => props.onChanged(e.target.value)} />
         :  <textarea 
               name={props.name} 
               defaultValue={props.value || ''}  
               className={classes} />
   )
}

export default StyledTextArea
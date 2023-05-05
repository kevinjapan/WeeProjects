import React from 'react'


const StyledInput = props => {

   let classes = "grow border border-slate-300 rounded focus:outline p-2 leading-3"

   // client may provide additional / override styling
   if(props.classes) classes += " " + props.classes

   const on_change = (e) => {

      // we exclude chars not URI friendly eg '/' - g since user could paste.
      let valid_string = e.target.value.replace(/\/|&|\.|<|>/g, '')   // regexp OR '|' multiple excludes

         // to do : this is currently a blacklist - more secure to create a whitelist - numbers/chars/some special chars
         //         issue is our generating the slug from this title - some elements will break url refreshing eg Todo view:
         //  <     >      ?     .     
         // what is our whitelist - how to handle any special chars we may want to permit.
         // - any char not in our whitelist we should remove
         
      if(props.onChanged) {
         props.onChanged(valid_string)
      }
   }

   return (
      props.onChanged
         ?  <input 
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
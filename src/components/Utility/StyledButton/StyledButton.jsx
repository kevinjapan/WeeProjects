import React from 'react'


//  for accessibility - we don't rely on tooltips.

const StyledButton = props => {

   let button_classes = "flex gap-1 items-center border rounded border-slate-300 w-fit h-fit m-1 p-1"
   button_classes += props.disabled
      ?   " text-slate-300 cursor-default"
      :   " hover:border-slate-500 text-slate-500 hover:text-slate-700 cursor-pointer"
   button_classes += " " + props.classes    // additional/override styling

   const aria_label = props["aria-label"] || ''
   let type = props.type ? props.type : "button"
   
   return (
      <button type={type} className={button_classes} aria-label={aria_label} onClick={props.onClicked}>
         {props.children}
      </button>
   )
}

export default StyledButton
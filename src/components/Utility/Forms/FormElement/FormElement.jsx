import React from 'react'



// styling wrapper for Form Rows (including responsiveness)

const FormElement = props => {
   return (
      <div className={`flex flex-col md:flex-row items-start gap-2 px-2 min-h-24 ${props.classes}`}>
         {props.children}
      </div>
   )
}

export default FormElement
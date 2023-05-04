import React from 'react'



// styling wrapper for Form Rows (including responsiveness)

const FormElement = props => {
   return (
      <div className={`flex flex-col md:flex-row items-start gap-2 ${props.classes}`}>
         {props.children}
      </div>
   )
}

export default FormElement
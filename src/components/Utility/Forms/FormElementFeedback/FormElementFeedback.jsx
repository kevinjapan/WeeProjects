import React from 'react'


const FormElementFeedback = props => {
   return (
      <div className={`flex justify-end text-sm h-5 mb-2 text-slate-500 italic ${props.feedback_msg ? 'bg-yellow-100 ' : ''}`}>
         {props.feedback_msg}
      </div>
   )
}

export default FormElementFeedback
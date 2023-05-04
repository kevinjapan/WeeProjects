import React, { useState,useEffect } from 'react'


const TimeStamps = props => {
   
   const [created_at,setCreatedAt] = useState(props.title)
   const [updated_at,setUpdatedAt] = useState(props.url)

   useEffect(() => {
      setCreatedAt(props.created_at)
      setUpdatedAt(props.updated_at)
   },[props])

   return (
      <div>
         <div className="row m-1">
            <div className="col-5 p-1">created at</div>
            <div className="col-7 p-1">{created_at}</div>
         </div>
         <div className="row m-1">
            <div className="col-5 p-1">updated at</div>
            <div className="col-7 p-1">{updated_at}</div>
         </div>
      </div>
   )
}

export default TimeStamps
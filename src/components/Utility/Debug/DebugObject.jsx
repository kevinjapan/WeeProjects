import React, { useState,useEffect } from 'react'


const DebugObject = props => {

   const [property_type,setPropertyType] = useState(props.property_type || 'keys')

   let label_style = {width:'fit-content',background:'#CCC',margin:'.5rem',padding:'.25rem'}
   let x_style = {width:'fit-content',background:'#EEE',margin:'.5rem',padding:'.25rem'}

   useEffect(() => {
      setPropertyType(props.property_type || 'keys')
   },[props.property_type])
   
   const list_keys = obj => {
      let arr = Object.keys(obj).map(key => (
         <li key={key} style={x_style}>{key}</li> 
      ))
      if(arr.length > 0) return arr
      return <li style={x_style}>object has no keys</li>
   }

   const list_values = obj => {
      let arr = Object.values(obj).map(value => (
         <li key={value} style={x_style}>{value}</li> 
      ))
      if(arr.length > 0) return arr
      return <li style={x_style}>object has no values</li>
   }
   
   const list_entries = obj => {
      let arr =  Object.entries(obj).map(entry => (
         <li key={entry} style={x_style}>{entry}</li> 
      ))
      if(arr.length > 0) return arr
      return <li style={x_style}>object has no entries</li>
   }

   return (
      <>
         {props.obj !== undefined && props.obj !== null ?
            <ul style={{width:'fit-content',margin:'.5rem',border:'solid 1px lightgrey',borderRadius:'.5rem'}}>               
               {props.object_name 
                  ?   <li style={label_style}>{props.object_name}</li>
                  :   null}
               {property_type === 'keys'
                  ?   list_keys(props.obj)
                  :   null}
               {property_type === 'values'
                  ?   list_values(props.obj)
                  :   null}
               {property_type === 'entries'
                  ?   list_entries(props.obj)
                  :   null}
            </ul>
         : null}
      </>    
   )
}

export default DebugObject
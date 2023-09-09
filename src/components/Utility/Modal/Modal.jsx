import React, { useEffect } from 'react'



const Modal = props => {

   const modal_bg_classes = "fixed top-0 left-0 z-40 flex justify-center items-center w-full h-full bg-black"
   const modal_classes = "z-50 flex flex-col w-12/12 sm:w-12/12 md:w-12/12 lg:w-full h-11/12 bg-white mx-5 text-slate-700 h-fit border rounded shadow px-10 py-3"

   // prevent body scroll when we are active
   useEffect(() => {
      if(props.show) document.body.classList.add('modal_is_active')
      return () => {
         document.body.classList.remove('modal_is_active')
      }
   },[])

   return (
      props.show && (
         <div className={modal_bg_classes} style={{background:'rgba(0,0,0,0.3)'}} onClick={()=>props.close_modal()}>
             <div className={modal_classes} onClick={e => e.stopPropagation()}>
                <div className="bg-white rounded h-10/12  overflow-y-auto max-h-screen">{props.children}</div>
             </div>
         </div>
      )
   )
}

export default Modal
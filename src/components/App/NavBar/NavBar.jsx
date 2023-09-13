import React from 'react'
import { Link } from 'react-router-dom'
import { NavBarProvider } from '../NavBar/NavBarContext'
import NavBarLg from '../NavBar/NavBarLg'
import NavBarSm from '../NavBar/NavBarSm'
import NavBarToggler from './NavBarToggler'
import truncate from '../../Utility/Stringer/uiStringer'



// NavBar is a simple, generic and responsive navigation bar
// - it can be used as main site or component local navigation (expanding to 100% width of container).
// - it encapsulates and displays a child links component (<ul> list element)
// - it provides breakpoint variation (css required) including a hamburger dropdown menu for sm screen sizes.

const NavBar = props => {
    
   // we retain heading tag for semantics, but style w/ tailwind
   const HeadingTag = props.title_tag || "h4"

   // client can override truncate title
   const truncate_title = props.truncate_title || true
   const title = truncate_title === true ? truncate(props.title,28) : props.title

   // client can append or override styles
   let classes = " pt-3 " 
   if(props.classes) classes += " " + props.classes

   return (
      <NavBarProvider>
         <div className="flex justify-between items-center z-50 w-full ">
               <div className="navbar_topbar">
                  <div className="navbar_title">
                     {props.title_link 
                        ?  <HeadingTag className={classes}>
                              <Link to={`${props.title_link}`}>{title}</Link>
                           </HeadingTag>
                        :  <HeadingTag className={classes}>{title}</HeadingTag>}
                  </div>
                  {props.children && (
                     <NavBarToggler />)}
               </div>

               {/* links / dropdown */}
               {props.children && (
                  <div className="w-fit px-4">
                     <NavBarLg>{props.children}</NavBarLg>
                     <NavBarSm>{props.children}</NavBarSm>
                  </div>
               )}
         </div>
      </NavBarProvider>
   )
}

export default NavBar
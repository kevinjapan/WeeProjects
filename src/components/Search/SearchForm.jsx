import React, { useState } from 'react'
import StyledInput from '../Utility/StyledInput/StyledInput'
import StyledButton from '../Utility/StyledButton/StyledButton'



const SearchForm = props => {
    
   const [search_term,setSearchTerm] = useState()

   const searchKeyPressed = (key,value) => {
      if(key === "Enter" && value !== '' ) {
         props.onSearch(search_term)
      }
   }

   return (
      <form className="my-5">
         <div className="w-fit mx-auto text-center border rounded p-5">

            <div className="">
               <label htmlFor="search" className="">Search for: </label>
               <StyledInput 
                  name="search" 
                  type="text"
                  value={search_term}
                  placeholder="enter your search term"
                  classes="grow"
                  onChanged={setSearchTerm}
                  onKeyDown={searchKeyPressed}></StyledInput>
            </div>

            <StyledButton aria-label="Search." onClicked={() => props.onSearch(search_term)}>
               Search
            </StyledButton>      
         </div>
      </form>
   )
}

export default SearchForm
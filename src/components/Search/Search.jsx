import React, { useState } from 'react'
import SearchResults from './SearchResults'
import SearchForm from './SearchForm'


const Search = () => {

   const [search_term,setSearchTerm] = useState("")

   return (
      <div className="">
         <SearchForm onSearch={setSearchTerm} />
         <SearchResults search_term={search_term} />
      </div>
   )
}

export default Search
import React, { useState,useEffect,useCallback,useContext } from 'react'
import { Link } from "react-router-dom"
import { AppContext } from '../App/AppContext/AppContext'
import reqInit from "../Utility/RequestInit/RequestInit"



// Search is currently limited to Todos

const SearchResults = props => {

   const { api } = useContext(AppContext)
   const [results_list,setResultsList] = useState([])
   const [num_results,setNumResults] = useState(0)
   const [outcome_msg,setOutcomeMsg] = useState("")

   const getSearchResults = useCallback( (search_term) => {

      setResultsList([])

      if(props.search_term !== "") {

         let myRequest = new Request(
               `${api}/search/${search_term}`,
               reqInit()
         )

         fetch(myRequest)
         .then(response => {
               return response.json()
         })
         .then(jsonDataSet => {
               if(jsonDataSet.outcome === "success") {
                  setResultsList(jsonDataSet.data)
                  setNumResults(jsonDataSet.data.length)
                  setOutcomeMsg(jsonDataSet.outcome)
               }
         })
         .catch(error => {
               // setState({ outcome_msg: notify('no_server_connect') })
               // setState({ results_list: [] })
                  setOutcomeMsg("Sorry, the server couldn't perform the search at this time: " . error)
         })
      }
      else {
         setOutcomeMsg("Please enter a search term")
      }
   },[api,props.search_term])

   useEffect(() => {
      setNumResults(-1)
      getSearchResults(props.search_term)
   },[getSearchResults,props.search_term])


   if (results_list !== undefined) 
   {
      return (
         <ul className="flex flex-col m-auto w-1/2 border ">
            {num_results > -1 ? <div>{num_results} results</div> : null}
            {results_list.map((todo,index) => (
               <Link key={index} to={`/songs/${todo.slug}`}>{todo.title}</Link>
            ))}
         </ul>
      )
   } 
   else {
      return <div>{outcome_msg}</div>
   }
}

export default SearchResults
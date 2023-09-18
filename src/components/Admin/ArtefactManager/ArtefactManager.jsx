import React from 'react'
import { Routes,Route,Link } from 'react-router-dom'
import ProjectsManager from './ProjectsManager/ProjectsManager'
import TasksManager from './TasksManager/TasksManager'
import TodosManager from './TodosManager/TodosManager'



const ArtefactManager = () => {





   return (
      <div>
         
         <ul className="flex gap-5 p-2 px-10">
            <li><Link to={`projects`} className="text-blue-600">Projects</Link></li>
         </ul>

         <Routes>

            <Route path="/projects" 
               element={
                  <ProjectsManager 
                  />
               }
            /> 

            <Route path="/projects/:project_slug/tasks" 
               element={
                  <TasksManager 
                  />
               }
            />

            <Route path="/projects/:project_slug/tasks/:task_slug/todos" 
               element={
                  <TodosManager 
                  />
               }
            />

         </Routes>
        
      </div>
   )
}

export default ArtefactManager

export default function projectReducer(project, action) {

   switch (action.type) {
      case 'add_task': {
         let modified = {...project}
         if(modified){
               if(!modified.tasks.some(task => task.id === action.task.id)) {
                  modified.tasks.unshift(action.task)
               }
         }
         return modified
      }
      case 'update_project': {
         return {...action.project}
      }
      case 'delete_project_local_copy': {
         return {}
      }
      default: {
         throw Error('Unknown action: ' + action.type);
      }
   }
}
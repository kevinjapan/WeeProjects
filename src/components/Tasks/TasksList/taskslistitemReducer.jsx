
export default function taskslistitemReducer(task, action) {

   switch (action.type) {
      case 'load': {
         return action.task
      }
      case 'check_todo': {
         return task 
      }
      case 'update_task': {
         return {...action.task}
      }
      default: {
         throw Error('Unknown action: ' + action.type);
      }
   }
}
import {ResponsiveBar, MainSection, Modal} from "./components";
import { useReducer } from 'react';
import StoreContext, {reducer} from "./store";
import AuthProvider from "./Auth";


export default function App() {
  const [state, dispatch] = useReducer(reducer,initState);
  
  return (
  <AuthProvider>
    <StoreContext.Provider value={{ state, dispatch }}>
      <div className="sm:flex h-screen">
        <ResponsiveBar />
        <MainSection />
      </div>
      <Modal />
    </StoreContext.Provider>
  </AuthProvider>
  );
}

const initState = {
  "tasks":{
    "Backlog":[
      {
         "id": 1,
         "name": "Login",
         "description": "Create Login form",
         "due": "2024-04-01",
         "priority": "High"
      },
      {
         "id": 3,
         "name": "Profile",
         "description": "Create Profile form",
         "due": "2024-04-02",
         "priority": "Medium"
      },
      {
         "id": 4,
         "name": "Dashboard",
         "description": "Create Dashboard form",
         "due": "2024-04-03",
         "priority": "Low"
      },
      {
         "id": 5,
         "name": "Settings",
         "description": "Create Settings form",
         "due": "2024-04-04",
         "priority": "High"
      }
     ], 
    "In Progress": [
      {
        "id": 2,
        "name": "Signup",
        "description": "Create Signup form",
        "due": "2024-03-04",
        "priority": "High"
      }
    ], 
    "In Review": [],
    "Done": []
  },
  "activeTask":null,
  "modal":{
    "type": null,
    "show": false,
    "container":null // in type of add item
  }
}
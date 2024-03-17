import {ResponsiveBar, MainSection, Modal} from "./components";
import { useReducer, useEffect } from 'react';
import StoreContext, {reducer,LOAD_PROJECTS,LOAD_TASKS} from "./store";
import AuthProvider from "./Auth";
import apiFetch from "./api";


export default function App() {
  const [state, dispatch] = useReducer(reducer,initState);
  const token = localStorage.getItem("authToken");
  
  useEffect(()=>async()=>{
    try{
      let projects = await apiFetch('/projects', 'GET', null,token);
      dispatch(LOAD_PROJECTS(projects))
      if (projects.length > 0) {
        const stProject = projects[0]
        let data = await apiFetch('/projects/'+stProject.id+'/tasks', 'GET', null,token);
        dispatch(LOAD_TASKS(stProject.id, data.tasks))
      }
    }catch(err){
      console.log(err)
    }
  },[])
  
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
    "Backlog":[], 
    "In Progress": [], 
    "In Review": [],
    "Done": []
  },
  "projects":[],
  "activeProject":null,
  "activeTask":null,
  "modal":{
    "type": null,
    "show": false,
    "container":null // in type of add task
  }
}
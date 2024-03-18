import {ResponsiveBar, MainSection, Modal} from "./components";
import { useReducer, useEffect } from 'react';
import StoreContext, { reducer,LOAD_PROJECTS } from "./store";
import AuthProvider, { AuthContext } from "./Auth";
import apiFetch from "./api";


export default function App() {
  const [state, dispatch] = useReducer(reducer,initState);
  const [isAuthenticated] = useReducer(AuthContext);
  const token = localStorage.getItem("authToken");

  const get_projects = async()=>{
    try{
      let projects = await apiFetch('/projects', 'GET', null,token);
      console.log(projects)
      dispatch(LOAD_PROJECTS(projects))
    }catch(err){
      console.log(err)
    }
  }
  useEffect(()=>{get_projects()},[])
  
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
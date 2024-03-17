import { AuthContext } from "../Auth"
import { useContext, useState } from "react"
import { FaRegUser, FaFolderPlus, FaFolder, FaFolderMinus, FaGithub    } from "react-icons/fa";
import StoreContext, {TOGGLE_MODAL, ADD_PROJECT, DELETE_PROJECT, SWITCH_PROJECT, LOAD_TASKS} from "../store";
import apiFetch from "../api";

const ResponsiveBar = () => {
  return (
    <>
      <MobileBar />
      <DesktopBar />
    </>
  )
}

export default ResponsiveBar

const MobileBar = () => {
  const {isAuthenticated} = useContext(AuthContext);
  const {state,dispatch} = useContext(StoreContext);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden">
      <div className="flex items-center justify-between rounded-md bg-white p-2 shadow-lg w-full">
        <button className="rounded-lg bg-white p-2 text-gray-400 shadow-md hover:text-gray-600">
          {/* <svg aria-hidden="true" className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg> */}
        </button>
        <button className="rounded-lg bg-white p-2 text-gray-400 shadow-md hover:text-gray-600">
          {/* <svg aria-hidden="true" className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
          </svg> */}
        </button>
        <button className="rounded-lg bg-white p-2 text-gray-400 shadow-md hover:text-gray-600">
          {/* <svg aria-hidden="true" className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
          </svg> */}
        </button>
        <a href="https://github.com/dindoucha" target="_blank" className="rounded-lg bg-black p-2 text-white shadow-md hover:text-gray-200">
          <FaGithub className="h-6 w-6"/>
        </a>
      </div>
    </div>

  )
}

const DesktopBar = ()  => {
  const token = localStorage.getItem("authToken");const {isAuthenticated,logout} = useContext(AuthContext);
  const {dispatch} = useContext(StoreContext);

  const [toggle,setToggle] = useState(false);

  const handlePopUp = () => {
    isAuthenticated ?  setToggle(!toggle) : dispatch(TOGGLE_MODAL({type:'LOGIN',show:true}))
  }

  const handleAddProject = async() => {
    try{
      const project = await apiFetch('/projects', 'POST', null, token);
      dispatch(ADD_PROJECT(project.id));
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <nav className="flex-col h-screen items-center hidden w-16 py-4 bg-slate-700 sm:flex">
      <div className="py-4">
        <a href="https://github.com/dindoucha" target="_blank" className="inline-block rounded-lg bg-black p-2 text-white shadow-md hover:text-gray-200">
          <FaGithub className="h-6 w-6"/>
        </a>
      </div>
      <div className="flex flex-col items-center flex-1 p-2 space-y-4">
        <ProjectsList />
        <button onClick={handleAddProject} className="p-2 transition-colors rounded-lg shadow-md hover:bg-indigo-800 hover:text-white text-slate-600 bg-white">
          <FaFolderPlus  className="w-6 h-6"/>
        </button>
      </div>

      <div className="relative flex items-center flex-shrink-0 p-2">
        <button className="transition-opacity text-white bg-slate-400 p-2 rounded-lg opacity-80 hover:opacity-100" onClick={handlePopUp} >
          <FaRegUser className="w-6 h-6" />
        </button>
        {
          toggle && (
          <div className="absolute w-48 overflow-hidden mt-2 origin-bottom-left bg-white rounded-md shadow-lg left-8 bottom-10 ">
            <button onClick={()=>{logout();setToggle(false)}} className="block w-full px-4 py-2 text-sm text-gray-700">Sign out</button>
          </div>)
        }
      </div>
    </nav>

  )
}

const ProjectsList = () => {
  const token = localStorage.getItem("authToken");

  const {state, dispatch} = useContext(StoreContext)

  const handleDeleteProject = async(projectId) => {
    try{
      await apiFetch('/projects/'+projectId, 'DELETE', null, token);
      dispatch(DELETE_PROJECT(projectId));
    } catch (err) {
      console.log(err)
    }
  }

  const handleSwitchProject = async(projectId) => {
    try{
      const found = state.projects.find(project=>project.id===projectId)
      if (found===-1)throw(Error('No such project'));
      let data = await apiFetch('/projects/'+projectId+'/tasks', 'GET', null,token);
      dispatch(LOAD_TASKS(projectId,data.tasks))
      dispatch(SWITCH_PROJECT(projectId));
    } catch (err) {
      console.log(err)
    }
  }

  return (
    state.projects.map(project=>(
      project.id === state.activeProject ?(
        <button key={project.id} onClick={()=>handleDeleteProject(project.id)} className="p-2 transition-colors rounded-lg shadow-md text-slate-600 bg-white hover:text-white hover:bg-red-600" >
          <FaFolderMinus className="w-6 h-6" />
        </button>
      ):(
        <button key={project.id} onClick={()=>handleSwitchProject(project.id)} className="p-2 transition-colors rounded-lg shadow-md text-slate-600 bg-white hover:text-white hover:bg-indigo-800">
          <FaFolder className="w-6 h-6"/>
        </button>
      )
    ))
  )
}
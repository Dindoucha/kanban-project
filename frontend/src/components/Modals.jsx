import { useContext, useState } from "react";
import StoreContext ,{ TOGGLE_MODAL, ADD_TASK} from "../store";
import { AuthContext } from "../Auth"
import { showToast } from "./Toast";
import apiFetch from "../api";

export const ModalTemplate = ({ children }) => {
  const { dispatch } = useContext(StoreContext);

  const closeModal = () => {
    dispatch(TOGGLE_MODAL({type:null,show:false}))
  }

  return (
    <div className="fixed left-0 right-0 top-0 z-50 flex h-screen w-screen items-center justify-center overflow-hidden">
      <div className="absolute h-screen w-screen bg-black opacity-75" onClick={()=>closeModal()}></div>
      <div className="relative max-h-full w-full max-w-2xl p-4">
        {/* Modal content */}
        <div className="relative rounded-lg bg-white shadow">
          {/* Modal header */}
          <button type="button" className="ms-auto inline-flex h-8 w-8 absolute top-4 right-4 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900" onClick={()=>closeModal()}>
            <svg className="h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
            </svg>
          </button>
          <div className="space-y-4 p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export const AddTaskModal = ()=>{
  const {state,dispatch} = useContext(StoreContext)
  const token = localStorage.getItem("authToken");

  const [task,setTask] = useState({project_id:state.activeProject})

  const handleChange = (e) => setTask({...task,[e.target.name]:e.target.value})

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!Object.values(task).every((v)=> v))return;
    try{
      const data = task
      data.container = state.modal.container
      data.order = state.tasks[data.container].length+1
      const response = await apiFetch("/tasks",'POST',data,token);
      data.id = response.id
      dispatch(ADD_TASK(data))
    }catch(err){
      console.log(err)
    }
  }
  return (
    <>
      <h3 className="text-xl font-semibold text-gray-900">Add Task</h3>
      <form className="space-y-6" action="#">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" required>Task Name</label>
          <input type="text" name="name" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm" onInput={handleChange} placeholder="Enter task name" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" required>Description</label>
          <textarea name="description" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm" onInput={handleChange} rows="4" placeholder="Enter task description"></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" required>Due Date</label>
          <input type="date" name="due" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm" onInput={handleChange} />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" required>Priority</label>
          <select name="priority" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm" onInput={handleChange}>
            <option value="">Select Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div className="flex justify-end">
          <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700" onClick={handleSubmit}>
            Add Task
          </button>
        </div>
      </form>
    </>
  )
}

export const LoginModal = ()=>{
  const { dispatch } = useContext(StoreContext);
  const { login } = useContext(AuthContext);
  const [user,setUser] = useState({email:"",password:""})

  const handleChange  = e => {
    setUser({...user,[e.target.name]:e.target.value})
  };

  const handleSubmit = e => {
    e.preventDefault();
    if(!Object.values(user).every((v)=> v))return; // check if all fields are not empty
    if(login(user.email,user.password)){
      // logged in close modal
      showToast("success","You have been successfully signed in.")
      dispatch(TOGGLE_MODAL({type:null,show:false}))
    } else {
      // showToast("error","You have been successfully signed out.")
    }
  }

  return (
    <>
      <h3 className="text-xl font-semibold text-gray-900">Sign in to your account</h3>
      <form className="space-y-6" action="#">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-900">Your email</label>
          <input type="email"  name="email" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm" placeholder="name@company.com" onInput={handleChange} required/>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-900">Password</label>
          <input type="password"  name="password" placeholder="••••••••" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm" onInput={handleChange} required/>
        </div>
        <button type="submit" onClick={handleSubmit} className="bg-indigo-600 hover:bg-indigo-700 w-full rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white">Sign in</button>
        <p className="text-sm font-light text-gray-500">Don't have an account yet? <a href="#" onClick={()=>dispatch(TOGGLE_MODAL({type:'REGISTER',show:true}))} className="text-indigo-600 font-medium hover:underline">Sign up</a></p>
      </form>
    </>
  )
}

export const RegisterModal = ()=>{
  const { dispatch } = useContext(StoreContext);
  const [user,setUser] = useState({email:"",password:""})

  const handleChange  = e => {
    setUser({...user,[e.target.name]:e.target.value})
  };

  return (
    <>
      <h3 className="text-xl font-semibold text-gray-900">Create a new account</h3>
      <form className="space-y-6" action="#">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-900">Your email</label>
          <input type="email"  name="email" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm" placeholder="name@company.com" onInput={handleChange} required/>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-900">Password</label>
          <input type="password"  name="password" placeholder="••••••••" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm" onInput={handleChange} required/>
        </div>
        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 w-full rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white">Sign in</button>
        <p className="text-sm font-light text-gray-500">Already have an account? <a href="#" onClick={()=>dispatch(TOGGLE_MODAL({type:'LOGIN',show:true}))} className="text-indigo-600 font-medium hover:underline">Sign in</a></p>
      </form>
    </>
  )
}

const Modal = ()=>{
  const {state} = useContext(StoreContext);
  return(
    state.modal.show && (
      <ModalTemplate>
        {state.modal.type === 'ADD_TASK' && <AddTaskModal />}
        {state.modal.type === 'ADD_PROJECT' && <AddTaskModal />}
        {/* Auth Modals */}
        {state.modal.type === 'LOGIN' && <LoginModal />}
        {state.modal.type === 'REGISTER' && <RegisterModal />}
      </ModalTemplate>
    )
  )
}

export default Modal
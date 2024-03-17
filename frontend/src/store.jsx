import { createContext, useContext } from "react";
import { arrayMove } from "@dnd-kit/sortable";

const StoreContext = createContext();
export default StoreContext;

export const reducer = (state,action) => {
  switch (action.type) {
    case "ACTIVE_TASK":
      {
        const activeTask = action.payload.activeTask;
        return {...state, ["activeTask"]:activeTask};
      }
    case "ADD_TASK":
      {
        const newTask = action.payload.newTask;
        const container = state.modal.container;
        return {
          ...state,
          tasks:{
            ...state.tasks,
            [container]: [...state.tasks[container],newTask]
          },
          modal:{
            type: null,
            show: false,
            container:null
          }
        };
      }
    case "DELETE_TASK":
      {
        const {taskId} = action.payload;
        const container = Object.keys(state.tasks).find((key) => state.tasks[key].some(task=>task.id === taskId));
        return {
          ...state,
          tasks:{
            ...state.tasks,
            [container]: [...state.tasks[container].filter((task) => task.id !== taskId)]
          }
        };
      }
    case "SWAP_TASKS":
      {
        const {activeIndex,overIndex,overContainer} = action.payload
        return {
          ...state,
          tasks:{
            ...state.tasks,
            [overContainer]:arrayMove(
              state.tasks[overContainer],
              activeIndex,
              overIndex
            )
          }
        }
      }
    case "SWITCH_CONTAINER":
      {
        const {activeContainer, overContainer, taskId, newIndex, activeIndex} = action.payload;
        return {
          ...state,
          tasks:{
            ...state.tasks,
            [activeContainer]: [
              ...state.tasks[activeContainer].filter((task) => task.id !== taskId),
            ],
            [overContainer]: [
              ...state.tasks[overContainer].slice(0, newIndex),
              state.tasks[activeContainer][activeIndex],
              ...state.tasks[overContainer].slice(newIndex, state.tasks[overContainer].length),
            ]
          }  
        };
      }
    case "ADD_PROJECT":{
      const projectId = action.payload.projectId
      const projects = [...state.projects,{"id":projectId}]
      return {
        ...state,
        projects:projects,
        activeProject:projects[0].id
      }
    }
    case "DELETE_PROJECT":{
      const projectId = action.payload.projectId
      const projects = state.projects.filter(project=>project.id !== projectId)
      return {
        ...state,
        projects:state.projects.filter(project=>project.id !== projectId),
        activeProject:projects.shift()?.id || null
      }
    }
    case "LOAD_PROJECTS":{
      const projects = action.payload.projects
      return {
        ...state,
        projects: projects
      }
    }
    case "LOAD_TASKS":{
      const {projectId,tasks} = action.payload
      return {
        ...state,
        tasks:tasks,
        activeProject:projectId
      }
    }
    case "SWITCH_PROJECT":{
      const {projectId} = action.payload
      return {
        ...state,
        activeProject:projectId
      }
    }
    case "TOGGLE_MODAL":
      {
        return {...state, ["modal"]:action.payload.modal};
    }

    default:
      return state;
  }
}


export const SET_ACTIVE_TASK = (activeTask) => {
  // const {dispatch} = useContext()
  return {
    type: "ACTIVE_TASK",
    payload: {
      activeTask
    }
  };
}

export const ADD_TASK = (newTask) => {
  return {
    type: "ADD_TASK",
    payload: {
      newTask
    }
  };
}

export const DELETE_TASK = (taskId) => {
  return {
    type: "DELETE_TASK",
    payload: {
      taskId
    }
  };
}

export const SWAP_TASKS = (activeIndex, overIndex, overContainer) => {
  return {
    type: "SWAP_TASKS",
    payload:{
      activeIndex,
      overIndex,
      overContainer
    }
  }
}

export const SWITCH_CONTAINER = (activeContainer, overContainer, taskId, newIndex,activeIndex) => {
  return {
    type: "SWITCH_CONTAINER",
    payload:{
      activeContainer,
      overContainer,
      taskId,
      newIndex,
      activeIndex
    }
  }
}

export const TOGGLE_MODAL = (modal) => {
  return {
    type: "TOGGLE_MODAL",
    payload: {
      modal
    }
  };
}

export const ADD_PROJECT = (projectId) => {
  return {
    type: "ADD_PROJECT",
    payload: {projectId}
  };
}

export const DELETE_PROJECT = (projectId) => {
  return {
    type: "DELETE_PROJECT",
    payload: {projectId}
  };
}

export const LOAD_PROJECTS = (projects) => {
  return {
    type: "LOAD_PROJECTS",
    payload: {projects}
  };
}

export const LOAD_TASKS = (projectId,tasks) => {
  return {
    type: "LOAD_TASKS",
    payload: {
      projectId,
      tasks
    }
  };
}

export const SWITCH_PROJECT = (projectId) => {
  return {
    type: "SWITCH_PROJECT",
    payload: {
      projectId
    }
  };
}

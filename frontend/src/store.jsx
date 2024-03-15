import { createContext } from "react";
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
    case "TOGGLE_MODAL":
      {
        return {...state, ["modal"]:action.payload.modal};
      }

    default:
      return state;
  }
}


export const SET_ACTIVE_TASK = (activeTask) => {
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


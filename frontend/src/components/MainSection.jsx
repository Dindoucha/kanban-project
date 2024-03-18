import { useContext, useEffect, useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import  StoreContext, { SET_ACTIVE_TASK, SWAP_TASKS, SWITCH_CONTAINER} from "../store";
import Container from "./Container";
import apiFetch from "../api"
import { Item } from "./Sortable_item";

const MainSection = () => {
  const {state,dispatch} = useContext(StoreContext);
  const token = localStorage.getItem("authToken")
  useEffect(() => {
    
    if (state.activeProject) {apiFetch("/tasks/mass-update","POST",{tasks:state.projects[state.activeProject].tasks},token);}
  }, [state.modal.container,state.activeTask]);

  const sensors = useSensors(
    useSensor(PointerSensor,{
      activationConstraint: {
        distance: 4
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
      activationConstraint: {
        distance: 4
      }
    })
  );
  
  const findContainer = (id) => {
    if (id in state.projects?.[state.activeProject]?.tasks) {
      return id;
    }
  
    return Object.keys(state.projects[state.activeProject].tasks).find((key) => state.projects[state.activeProject].tasks[key].some(item=>item.id === id));
  }

  const handleDragStart = (event) => {
    const { active } = event;
    const { id } = active;
    const activeContainer = findContainer(id)

    dispatch(SET_ACTIVE_TASK(state.projects[state.activeProject].tasks[activeContainer].find(item=>item.id === id)));
  }

  const handleDragOver = (event) => {
    const { active, over, delta } = event;
    const { id } = active;
    const { id: overId } = over;

    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    const activeItems = state.projects[state.activeProject].tasks[activeContainer];
    const overItems = state.projects[state.activeProject].tasks[overContainer];

    const activeIndex = activeItems.findIndex(item=>item.id === id);
    const overIndex = overItems.findIndex(item=>item.id === overId);

    let newIndex;
    if (overId in state.projects[state.activeProject].tasks) {
      newIndex = overItems.length + 1;
    } else {
      const isBelowLastItem =
        over &&
        overIndex === overItems.length - 1 &&
        delta.x > over.rect.offsetTop + over.rect.height;

      const modifier = isBelowLastItem ? 1 : 0;

      newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
    }

    dispatch(SWITCH_CONTAINER(activeContainer,overContainer,active.id,newIndex,activeIndex))
  }

  const handleDragEnd = (event) => {
    const { active, over } = event;
    const { id } = active;
    const { id: overId } = over;

    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer !== overContainer
    ) {
      return;
    }

    dispatch(SWAP_TASKS(id,overId,activeContainer));
    dispatch(SET_ACTIVE_TASK(null));
  }
  console.log("hh",state.projects?.[state.activeProject]?.tasks)
  return (
    <div className="grid grid-cols-2 sm:grid-rows-1 grid-rows-2 sm:grid-cols-4 gap-4 p-4 bg-gray-900 h-[calc(100dvh-3.5rem)] sm:h-screen w-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        >
        <Container id="Backlog" items={state.projects?.[state.activeProject]?.tasks?.["Backlog"] || []} />
        <Container id="In Progress" items={state.projects?.[state.activeProject]?.tasks?.["In Progress"] || []} />
        <Container id="In Review" items={state.projects?.[state.activeProject]?.tasks?.["In Review"] || []} />
        <Container id="Done" items={state.projects?.[state.activeProject]?.tasks?.["Done"] || []} />
        <DragOverlay>{state.activeTask ? <Item item={state.activeTask} /> : null}</DragOverlay>
      </DndContext>
    </div>
  )
}

export default MainSection

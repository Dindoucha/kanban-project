import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useContext } from "react";
import StoreContext, { TOGGLE_MODAL } from "../store";

import SortableItem from "./Sortable_item";

export default function Container(props) {
  const { id, items } = props;
  const { dispatch } = useContext(StoreContext);
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <SortableContext
      id={id}
      items={items}
      strategy={verticalListSortingStrategy}
    >
      <div className="grid grid-rows-12 grid-flow-col bg-gray-700 border-gray-600 rounded-md overflow-hidden">
        <div className="row-span-1 px-4 py-2 items-center flex justify-center">
          <h2 className="font-semibold text-white"><Emojis  id={id} /></h2>
        </div>
        <div className="px-4 overflow-y-auto row-span-10" ref={setNodeRef}>
          {items.map((item) => (
            <SortableItem key={item.id} item={item} />
            ))}
        </div>
        <div className="row-span-1 text-white border-gray-800 border-t" onClick={()=>dispatch(TOGGLE_MODAL({type:'ADD_TASK',show:true,container:id}))}>
          <button className="h-full w-full hover:bg-gray-600">Add Task</button>
        </div>
      </div>
    </SortableContext>
  );
}


const Emojis = ({id})=>{

  switch (id){
    case "Backlog":
      return (<>📋 {id}</>) 
    case "In Progress":
      return (<>🛠️ {id}</>)
    case "In Review":
      return (<>🕵🏼 {id}</>) 
    case "Done":
      return (<>✔️ {id}</>) 
    default:
      return (<>{id}</>)
  }

}
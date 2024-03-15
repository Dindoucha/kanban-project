import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaRegTrashAlt  } from "react-icons/fa";
import { useContext } from "react";
import StoreContext, {DELETE_TASK} from "../store";

export function Item({item}) {
  const {state,dispatch} = useContext(StoreContext);

  const handleDelete = () => dispatch(DELETE_TASK(item.id))
  
  return (
    <div className={`w-full mb-2 bg-gray-800 cursor-grab rounded-md text-gray-200 hover:border-gray-200 border-2 border-gray-800 ${state.activeTask?.id===item.id && "opacity-75"}`}>
      <div className="p-2">
        <div className="flex justify-between items-center">
          <h5 className="text-lg mb-2 text-gray-400">
            {item.name}
          </h5>
          <button onClick={handleDelete} className="text-red-400 z-40 hover:text-red-900 hover:bg-red-100 p-1 rounded-md"><FaRegTrashAlt  /></button>
        </div>
        <p className="text-sm sm:text-xs">
          {item.description}
        </p>
        
      </div>
      <div className="grid sm:grid-cols-2 grid-cols-1 text-sm sm:text-xs p-2 text-left sm:text-center border-gray-700 border-t">
        <div>
          <span className="text-gray-400">Due:</span>
          <span className="text-gray-200 ml-2">{item.due}</span>
        </div>
        <div>
          <span className="text-gray-400">Priority:</span>
          <span className="text-gray-200 ml-2">{item.priority}</span>
        </div>
      </div>
    </div>
  );
}

export default function SortableItem({item}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Item item={item} />
    </div>
  );
}

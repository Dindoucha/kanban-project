import {useDroppable} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";

function Droppable(props) {
  const {isOver, setNodeRef} = useDroppable({
    id: props.id
  });
  
  return (
    <div className={props.className} ref={setNodeRef}>  
      <SortableContext items={props.items} strategy={verticalListSortingStrategy}>
        {props.children}
      </SortableContext>
    </div>
  );
}

export default Droppable
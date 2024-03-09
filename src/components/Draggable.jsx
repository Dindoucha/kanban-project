import {useDraggable} from '@dnd-kit/core';
import {CSS} from '@dnd-kit/utilities';
import {
  Card,
  CardBody,
  Typography
} from "@material-tailwind/react";

function Draggable({item}) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: item.id,
  });
  
  const style = {
    // Outputs `translate3d(x, y, 0)`
    transform: CSS.Translate.toString(transform),
  };

  return (
    <Card className='w-full mb-2 bg-slate-400' ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <CardBody>
        <Typography variant="h5" color="slate" className="mb-2">
          {item.name}
        </Typography>
        <Typography>
          {item.description}
        </Typography>
      </CardBody>
    </Card>
  );
}

export default Draggable
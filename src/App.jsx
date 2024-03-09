import {useState} from 'react';
import { DndContext } from '@dnd-kit/core';
import Draggable from './components/Draggable';
import Droppable from './components/Droppable';

const DraggableItems = ({stepId,items}) =>{
  const matchingItems = items.filter(item=> item.step === stepId)
  return (
    matchingItems.length > 0 ? matchingItems.map(item=><Draggable key={item.id} item={item}/>): (<p>nothing here</p>)
  );}

function App() {
  const [items, setItems] = useState([
    {id: 1, name: "Login", description: "Create Login form", step: 1},
    {id: 2, name: "Signup", description: "Create Signup form", step: 1},
    {id: 3, name: "Profile", description: "Create Profile form", step: 1},
    {id: 4, name: "Dashboard", description: "Create Dashboard form", step: 1},
    {id: 5, name: "Settings", description: "Create Settings form", step: 1}
   ]);
   
  const steps = [
    {id:1,name:"Backlog"},
    {id:2,name:"In progress"},
    {id:3,name:"In review"},
    {id:4,name:"Done"}
  ]
  
  const handleDragEnd = (x) => {
    console.log(x)
    // setItems(prevItems => {
    //   return prevItems.map(item =>
    //      item.id === active.id ? { ...item, step: over.id } : item
    //   );
    //  });
  };


  return (
    <div className="grid grid-cols-4 gap-4 p-4 bg-gray-900 h-[100vh]">
      <DndContext onDragEnd={handleDragEnd}>
        {steps.map(step => (
          <Droppable items={items} className="p-4 bg-gray-700 border-gray-600 rounded-md" key={step.id} id={step.id} >
            <DraggableItems items={items} stepId={step.id} />
          </Droppable>
        ))}
      </DndContext>
    </div>
  )
}

export default App

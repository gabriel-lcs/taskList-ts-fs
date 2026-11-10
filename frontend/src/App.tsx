import { useEffect, useState } from 'react'
import Input from './components/Input'
import TaskList from './components/TaskList'
import type { Task } from './types/tasks'

function App() {

    const [tasks, setTasks] = useState<Task[]>([])

    useEffect(() => {
      async function get() {
        try {
              const res = await fetch("http://localhost:8080/tasks");
              const data = await res.json();
  
              if(!res.ok){
                  console.log(data);
                  return;
              }

              setTasks(data);
  
          } catch (error) {
              console.log(error)
          }
      }
      get();
    }, [])

    function addTask(task: Task){
      setTasks(atual => [...atual, task])
    }
    
  return (
    <>
      <div className='flex items-center w-full justify-center flex-col'>
        <Input newInput={addTask}/>
        <TaskList tasks={tasks}/>
      </div>
    </>
  )
}

export default App

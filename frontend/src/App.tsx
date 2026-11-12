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
    setTasks(atual => [...atual, task]);
  }

  function deleteTask(id: string){
    setTasks(atual => atual.filter((task) => task.id !== id));
  }

  function updateTask(task: Task){
    setTasks(atual => atual.map(t => t.id === task.id ? task : t))
  }
    
  return (
    <>
      <div className='flex items-center w-full justify-center flex-col'>
        <Input newInput={addTask}/>
        <TaskList atualizar={updateTask} deletar={deleteTask} tasks={tasks}/>
      </div>
    </>
  )
}

export default App

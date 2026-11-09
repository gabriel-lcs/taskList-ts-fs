import Input from './components/Input'
import TaskList from './components/TaskList'

function App() {
  return (
    <>
      <div className='flex items-center w-full justify-center flex-col'>
        <Input />
        <TaskList />
      </div>
    </>
  )
}

export default App

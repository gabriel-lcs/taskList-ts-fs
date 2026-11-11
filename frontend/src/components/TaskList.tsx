import type { Task } from "../types/tasks";
import TaskItem from "./TaskItem";

function TaskList(props: { tasks: Task[], deletar: ((id: string) => void)}){
    return(
        <>
            <div>
                {
                    props.tasks.map(t => {
                        return <TaskItem key={t.id} task={t} deletar={props.deletar}/>
                    })
                }
            </div>
        </>
    )
}

export default TaskList;
import { useEffect, useState } from "react";

function TaskList(){
    type Task = {
        id: string;
        name: string;
        status: string;
    }

    const [task, setTask] = useState<Task[]>([]);

    async function getTask() {
        try {
            const res = await fetch("http://localhost:8080/tasks");
            const data = await res.json();

            if(!res.ok){
                console.log(data);
            }

            setTask(data);
        } catch (error) {
            console.log(error)
        }
    }

    

    useEffect(() => {
        getTask();
    }, [])

    return(
        <>
            <div>
                {
                    task.map(t => {
                        return <div className="flex border m-3">
                            <div className="p-4">
                                {t.name}
                            </div>
                            <div className="p-4">
                                {t.status}
                            </div>
                        </div>
                        
                        
                    })
                }
            </div>
        </>
    )
}

export default TaskList;
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
                        return <div className="flex m-3">
                            <div className="flex border w-full text-center">
                                <div className="p-4 min-w-80">
                                    {t.name}
                                </div>

                                <div className="p-4 border-l w-40 ml-auto">
                                    {t.status}
                                </div>
                            </div>

                            <div>
                                <button className="ml-4 p-4 border cursor-pointer">Editar</button>
                            </div>

                        </div>
                        
                       
                        
                        
                    })
                }
            </div>
        </>
    )
}

export default TaskList;
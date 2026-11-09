import { useEffect, useState } from "react";
import {Enum} from "../../../backend/src/schemas/tasksSchema";

function TaskList(){
    type Task = {
        id: string;
        name: string;
        status: Enum;
    }

    const Colors = {
        [Enum.EmAndamento]: "bg-yellow-200",
        [Enum.Concluido]: "bg-green-200",
        [Enum.Pendente]: "bg-red-200"
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
                        return <div className="flex m-3 text-sm">
                            <div className="flex border w-full rounded-lg text-center shadow-sm">
                                <div className="p-4 min-w-80">
                                    {t.name}
                                </div>

                                <div className={`p-4 border-l w-40 ml-auto ${Colors[t.status]}`}>
                                    {t.status}
                                </div>
                            </div>

                            <div>
                                <select className="ml-4 w-full rounded-lg border shadow-sm p-4 appearance-none text-center" >
                                    <option value="" disabled selected>Editar</option>
                                    <option value="1">Editar Nome</option>
                                    <option value="2">Editar Status</option>
                                    <option value="3">Excluir tarefa</option>
                                </select>
                            </div>

                        </div>
                    })
                }
            </div>
        </>
    )
}

export default TaskList;
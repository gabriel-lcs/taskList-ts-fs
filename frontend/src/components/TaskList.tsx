import {Enum} from "../../../backend/src/schemas/tasksSchema";
import type { Task } from "../types/tasks";

function TaskList(props: { tasks: Task[] }){

    const Colors = {
        [Enum.EmAndamento]: "bg-yellow-200",
        [Enum.Concluido]: "bg-green-200",
        [Enum.Pendente]: "bg-red-200"
    }

    return(
        <>
            <div>
                {
                    props.tasks.map(t => {
                        return <div className="flex m-3 text-sm">
                            <div className="flex border w-full text-center shadow-sm rounded-b-lg">
                                <div className="p-4 min-w-80 ">
                                    {t.name}
                                </div>

                                <div id="campStatus" className={`p-4 border-l rounded-br-lg w-40 ml-auto ${Colors[t.status]}`}>
                                    {t.status}
                                </div>
                            </div>

                            <div>
                                <select id="btnEditar" className="ml-4 w-full rounded-lg border shadow-sm p-4 appearance-none text-center bg-blue-200" >
                                    <option value="" disabled selected>Editar</option>
                                    <option value="1">Editar</option>
                                    <option value="2">Excluir</option>
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
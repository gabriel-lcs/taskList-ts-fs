import type { Task } from "../types/tasks";
import { Colors } from "../enums/colors"

function TaskItem(props: { task: Task, deletar: ((id: string) => void)}){

    async function deletar(){
        const res = await fetch (`http://localhost:8080/tasks/${props.task.id}`, {
            method: "DELETE"
        })

        const data = await res.json();

        if(!res.ok){
            console.log(data);
            return
        }

        props.deletar(props.task.id);
    }

    return(
        <>
            <div className="flex m-3 text-sm">
                    <div className="flex border w-full text-center shadow-sm rounded-b-lg">
                        <div className="p-4 min-w-80 ">
                            {props.task.name}
                        </div>

                        <div id="campStatus" className={`p-4 border-l rounded-br-lg w-40 ml-auto ${Colors[props.task.status]}`}>
                                {props.task.status}
                        </div>
                    </div>

                    <div>
                        <select onChange={(e) => (e.target.value) === "2" ? deletar() : console.log("erro")} id="btnEditar" className="ml-4 w-full rounded-lg border shadow-sm p-4 appearance-none text-center bg-blue-200" >
                            <option value="" disabled selected>Opções</option>
                            <option value="1">Editar</option>
                            <option value="2">Excluir</option>
                        </select>
                    </div> 
            </div>
        </>
    )
}

export default TaskItem;
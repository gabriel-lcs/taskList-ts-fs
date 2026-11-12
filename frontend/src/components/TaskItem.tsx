import type { Task } from "../types/tasks";
import { Colors } from "../enums/enums"
import { useState } from "react";
import { Enum } from "../enums/enums";

function TaskItem(props: { task: Task, deletar: ((id: string) => void)}){

    const valuesEnum = Object.values(Enum).filter((status) => status !== props.task.status)

    const [ nome, setNome] = useState(props.task.name);
    const [ status, setStatus] = useState(props.task.status);
    const [editando, setEditando] = useState(false);
    const [opcoes, setOpcoes] = useState("");

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
            <div className="flex m-3 text-sm mb-0">
                    <div className="flex border w-full text-center shadow-sm rounded-b-lg">
                        <div className="p-4 min-w-80 ">
                            {props.task.name}
                        </div>

                        <div id="campStatus" className={`p-4 border-l rounded-br-lg w-40 ml-auto ${Colors[props.task.status]}`}>
                                {props.task.status}
                        </div>
                    </div>

                    <div>
                        <select onChange={(e) => {
                            setOpcoes(e.target.value)
                            if(e.target.value === "1"){
                                setEditando(true)
                            } else{
                                deletar()
                            }}} 
                            id="btnEditar" value={opcoes} className="cursor-pointer ml-4 w-full rounded-lg border shadow-sm p-4 appearance-none text-center bg-blue-200" >
                            <option value={""} disabled selected>Opções</option>
                            <option value="1">Editar</option>
                            <option value="2">Excluir</option>
                        </select>
                    </div> 
            </div>

            <div>{editando ? (<div className="flex text-sm w-fit">
                <input className="border ml-3 p-2 rounded-lg" placeholder={nome} onChange={((e) => setNome(e.target.value))}/> 

                <select className="cursor-pointer border ml-3 p-2 rounded-lg" onChange={((e) => console.log(setStatus(e.target.value as Enum)))}>
                    <option value="" disabled selected>Status</option>
                    {valuesEnum.map((s) => {
                        return <option 
                        value={s} key={s}> {s}
                        </option>
                    })}
                </select>

                <button className="cursor-pointer border ml-3 p-2 " onClick={() => {
                    setEditando(false); 
                    setNome(props.task.name);
                    setStatus(props.task.status)
                    setOpcoes("");}}>Cancelar</button>
                </div>) : (<p></p>)}
            </div>
        </>
    )
}

export default TaskItem;
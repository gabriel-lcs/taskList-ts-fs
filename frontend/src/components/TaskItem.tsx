import type { Task } from "../types/tasks";
import { Colors } from "../enums/enums"
import { useState } from "react";
import { Enum } from "../enums/enums";

function TaskItem(props: { task: Task, deletar: ((id: string) => void), atualizar: ((task: Task) => void)}){

    const valuesEnum = Object.values(Enum).filter((status) => status !== props.task.status)

    const [ nome, setNome ] = useState(props.task.name);
    const [ status, setStatus ] = useState(props.task.status);
    const [ editando, setEditando ] = useState(false);
    const [ opcoes, setOpcoes ] = useState("");

    async function deletar(){
        const res = await fetch (`http://localhost:8080/tasks/${props.task.id}`, {
            method: "DELETE"
        });

        const data = await res.json();

        if(!res.ok){
            console.log(data);
            return
        }

        props.deletar(props.task.id);
    }

    async function atualizar() {
        const res = await fetch(`http://localhost:8080/tasks/${props.task.id}`,{
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: nome, status: status})
        });

        const data = await res.json();

        if(!res.ok){
            console.log(data);
            return
        }

        console.log(data)
        props.atualizar(data);
        setEditando(false);
        setOpcoes("");
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

            <div>{editando ? (<div id="divEditando" className="flex text-sm ml-5 mr-27 h-10 border rounded-b-lg p-1 bg-gray-200">
                <input className="border w-70 p-2 rounded-lg" placeholder={nome} onChange={((e) => setNome(e.target.value))}/> 

                <select className="text-center cursor-pointer border ml-3 rounded-lg w-20" onChange={((e) => setStatus(e.target.value as Enum))}>
                    <option value="" disabled selected>Status</option>
                    {valuesEnum.map((s) => {
                        return <option 
                        value={s} key={s}> {s}
                        </option>
                    })}
                </select>

                <button id="btnCancelar" className="flex items-center justify-center cursor-pointer ml-4  w-fit rounded-lg border shadow-sm p-2 bg-red-400" onClick={() => {
                    setEditando(false); 
                    setNome(props.task.name);
                    setStatus(props.task.status)
                    setOpcoes("");}}>Cancelar</button>

                 <button id="btnSalvar" className="flex items-center justify-center cursor-pointer ml-4 w-fit rounded-lg border shadow-sm p-2 bg-green-400" onClick={() => {
                    atualizar();}}>Salvar</button>
                </div>) : (<p></p>)}
            </div>
        </>
    )
}

export default TaskItem;
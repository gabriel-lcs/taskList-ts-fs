import { useState } from "react";
import type { Task } from "../types/tasks";

function Input(props: {newInput: (task: Task) => void} ){

    const [task, setTask] = useState("");

    async function postTask() {
        try {
            const res = await fetch("http://localhost:8080/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name: task })
            })

            const data = await res.json();

            if(!res.ok){
                console.log(data)
                return
            }

            props.newInput(data);
            setTask("");
            
        } catch (error) {
            console.log(error)
        }
    }
    
    return(
        <>
            <div className="flex m-10">
                <input type="text" 
                className="border p-2 rounded-lg shadow-sm" placeholder="Insira uma tarefa"
                value={task}
                onChange={(e) => {setTask(e.target.value)}}/>

                <button className="border ml-3 p-2 rounded-lg shadow-sm" onClick={postTask}>Enviar</button>
            </div>
        </>
    )
}

export default Input;
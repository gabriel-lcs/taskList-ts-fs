import { useState } from "react";

function Input(){

    const [task, setTask] = useState("");

    async function postTask() {
        try {
            const res = await fetch("http://localhost:8080/tasks", {
                method: "POST"
            })
        } catch (error) {
            console.log(error)
        }
    }
    

    return(
        <>
            <div>
                <input type="text" placeholder="Insira uma tarefa"/>
            </div>
        </>
    )
}

export default Input;
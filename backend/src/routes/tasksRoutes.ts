import { db } from "../database/database.js";
import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { tasksSchemaId, taskSchemaCreate, taskSchemaUpdate, Task } from "../schemas/tasksSchema.js";

export async function tasksRoutes(app: FastifyInstance) {

    app.get("/tasks", async (req, rep) => {
        return await db<Task[]>`select id, name, status, created_at from tasks order by created_at`;
    })

    app.get("/tasks/:id", async (req, rep) => {
        const validId = tasksSchemaId.parse(req.params);
        
        const consulta = await db<Task[]>`select id, name, status, created_at from tasks where id = (${validId.id})`

        if (consulta[0] === undefined){
            return rep.code(StatusCodes.NOT_FOUND).send( { error: "Not found" } )
        }

        return rep.code(StatusCodes.OK).send(consulta[0]);
    })

    app.post("/tasks", async (req, rep) => {
        const entrada = taskSchemaCreate.parse(req.body);
        
        const novaTask = await db<Task[]>`insert into tasks (name) values (${ entrada.name }) returning *`
                    
        return rep.code(StatusCodes.CREATED).send(novaTask[0]);
    })
                    
    app.delete("/tasks/:id", async (req, rep) => {
        const id = tasksSchemaId.parse(req.params);

        const deletar = await db<Task[]>`delete from tasks where id = (${id.id}) returning *`

        if (deletar[0] === undefined){
            return rep.code(StatusCodes.NOT_FOUND).send( { error: "Not found" } );
        }

        return rep.code(StatusCodes.OK).send(deletar[0]);
    })

    app.patch("/tasks/:id", async (req, rep) => {
        const entradaDados = taskSchemaUpdate.parse(req.body);

        const id = tasksSchemaId.parse(req.params);

        const update = await db<Task[]>`update tasks set ${db(entradaDados)} where id = ${id.id} returning *`

        if(update[0] === undefined){
            return rep.code(StatusCodes.NOT_FOUND).send({ error: "Not found" })
        }

        return rep.code(StatusCodes.OK).send(update[0])  
    })
}
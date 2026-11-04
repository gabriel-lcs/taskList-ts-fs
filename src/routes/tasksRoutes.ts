import { db } from "../database/database.js";
import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { tasksSchemaId, taskSchemaCreate, taskSchemaUpdate } from "../schemas/tasksSchema.js";

export async function tasksRoutes(app: FastifyInstance) {

    app.get("/tasks", async (req, rep) => {
        return await db`select id, name, status from tasks`;
    })

    app.get<{ Params: { id: string } }>("/tasks/:id", async (req, rep) => {
        const validId = tasksSchemaId.safeParse(req.params);
        
        if(!validId.success){
            return rep.code(StatusCodes.BAD_REQUEST).send({ error: validId.error.issues });
        }
        
        const consulta = await db`select id, name, status from tasks where id = (${validId.data.id})`

        if (consulta[0] === undefined){
            return rep.code(StatusCodes.NOT_FOUND).send( { error: "Not found" } )
        }

        return rep.code(StatusCodes.OK).send(consulta[0]);
    })

    app.post("/tasks", async (req, rep) => {
        const entrada = taskSchemaCreate.safeParse(req.body);
        
        if (!entrada.success){
            return rep.code(StatusCodes.BAD_REQUEST).send({ error: entrada.error.issues })
        } 
        
        const novaTask = await db`insert into tasks (name) values (${ entrada.data.name }) returning *`
                    
        return rep.code(StatusCodes.CREATED).send(novaTask[0]);
    })
                    
    app.delete<{Params: { id: string }}>("/tasks/:id", async (req, rep) => {
        const id = tasksSchemaId.safeParse(req.params);

        if (!id.success){
            return rep.code(StatusCodes.BAD_REQUEST).send( { error: id.error.issues } );
        }

        const deletar = await db`delete from tasks where id = (${id.data.id}) returning *`

        if (deletar[0] === undefined){
            return rep.code(StatusCodes.NOT_FOUND).send( { error: "Not found" } );
        }

        return rep.code(StatusCodes.OK).send(deletar[0]);
    })

    app.patch<{ Params: { id: string } }>("/tasks/:id", async (req, rep) => {
        const entradaDados = taskSchemaUpdate.safeParse(req.body);

        if(!entradaDados.success) {
            return rep.code(StatusCodes.BAD_REQUEST).send( { error: entradaDados.error.issues } );
        }

        const id = tasksSchemaId.safeParse(req.params);

        if(!id.success){
            return rep.code(StatusCodes.BAD_REQUEST).send( { error: id.error.issues } );
        }

        const update = await db`update tasks set ${db(entradaDados.data)} where id = ${id.data.id} returning *`

        if(update[0] === undefined){
            return rep.code(StatusCodes.NOT_FOUND).send({ error: "Not found" })
        }

        return rep.code(StatusCodes.OK).send(update[0])  
    })
}
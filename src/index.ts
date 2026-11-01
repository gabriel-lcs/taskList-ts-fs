import fastify from "fastify";
import { StatusCodes } from "http-status-codes";
import z from "zod";
import { db } from "./database/database.js";

const app = fastify();

enum Enum {
    Pendente = "Pendente",
    EmAndamento = "Em andamento",
    Concluido = "Concluido"
}
    
const StatusEnum = z.enum(Enum);

const taskSchemaCreate = z.object({
    name: z.string().min(3)
})

const taskSchemaUptade = z.object({
    name: z.string().min(3).optional(),
    status: StatusEnum.optional()
}).refine((data) => data.name || data.status, {
    error: "Envie pelo menos um campo (name ou status)"
})

const tasksSchameId = z.object({
    id: z.uuid()
})

app.get("/tasks", async (req, rep) => {
    return await db`select id, name, status from tasks`;
})

app.get<{ Params: { id: string } }>("/tasks/:id", async (req, rep) => {
    const validId = tasksSchameId.safeParse(req.params);
    
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
    const id = tasksSchameId.safeParse(req.params);

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
    const entradaDados = taskSchemaUptade.safeParse(req.body);

    if(!entradaDados.success) {
        return rep.code(StatusCodes.BAD_REQUEST).send( { error: entradaDados.error.issues } );
    }

    const id = tasksSchameId.safeParse(req.params);

    if(!id.success){
        return rep.code(StatusCodes.BAD_REQUEST).send( { error: id.error.issues } );
    }

    const update = await db`update tasks set ${db(entradaDados.data)} where id = ${id.data.id} returning *`

    if(update[0] === undefined){
        return rep.code(StatusCodes.NOT_FOUND).send({ error: "Not found" })
    }

    return rep.code(StatusCodes.OK).send(update[0])  
})

async function startServer(){
    try {
        const rota = await app.listen({ port: 8080 });
        console.log(`Server is now listening on ${rota}`);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

startServer();

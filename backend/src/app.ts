import fastify, { FastifyError } from "fastify";
import { tasksRoutes } from "./routes/tasksRoutes.js";
import cors from "@fastify/cors";
import { ZodError } from "zod";
import { StatusCodes } from "http-status-codes";

export const app = fastify(
    { logger: true }
);

app.setErrorHandler<FastifyError>((err, req, rep) => {
    if(err instanceof ZodError){
        rep.code(StatusCodes.BAD_REQUEST).send({ error: err.issues });
    }else{
        if (err.statusCode !== undefined && err.statusCode >= 400 && err.statusCode < 500){
            rep.code(err.statusCode).send({ error: err.message });  
        }else{
            req.log.error(err);

            rep.code(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: "Erro interno de servidor" });
        }
    }
});

await app.register(cors, {
    origin: "http://localhost:5173",
    methods: ["GET", "HEAD", "POST", "PATCH", "DELETE", "PUT"]
});

app.register(tasksRoutes);
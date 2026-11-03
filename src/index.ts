import fastify from "fastify";
import { tasksRoutes } from "./routes/tasksRoutes.js";

const app = fastify();

app.register(tasksRoutes);

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

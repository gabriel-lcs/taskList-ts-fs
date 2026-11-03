import { app } from "./app.js";

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

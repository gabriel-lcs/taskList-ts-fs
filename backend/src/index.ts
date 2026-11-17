import { app } from "./app.js";

async function startServer(){
    try {
        const rota = await app.listen({ port: Number(process.env.PORT) || 8080, host: "0.0.0.0" });
        console.log(`Server is now listening on ${rota}`);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

startServer();

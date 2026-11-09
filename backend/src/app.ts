import fastify from "fastify";
import { tasksRoutes } from "./routes/tasksRoutes.js";
import cors from "@fastify/cors";

export const app = fastify();

await app.register(cors, {
    origin: "http://localhost:5173",
    methods: ["GET", "HEAD", "POST", "PATCH", "DELETE", "PUT"]
})

app.register(tasksRoutes);
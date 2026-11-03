import fastify from "fastify";
import { tasksRoutes } from "./routes/tasksRoutes.js";

export const app = fastify();

app.register(tasksRoutes);
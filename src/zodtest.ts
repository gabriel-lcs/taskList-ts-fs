import { z } from "zod";

export const TaskSchema = z.object({
    nome: z.string().min(3)
})


import z from "zod";

export enum Enum {
    Pendente = "Pendente",
    EmAndamento = "Em andamento",
    Concluido = "Concluido"
}

export const StatusEnum = z.enum(Enum);

const TaskSchema = z.object({
    id: z.uuid(),
    name: z.string().min(3),
    status: StatusEnum,
    created_at: z.date()
})

export type Task = z.infer<typeof TaskSchema>

export const taskSchemaCreate = z.object({
    name: z.string().min(3)
})

export const taskSchemaUpdate = z.object({
    name: z.string().min(3).optional(),
    status: StatusEnum.optional()
}).refine((data) => data.name || data.status, {
    error: "Envie pelo menos um campo (name ou status)"
})

export const tasksSchemaId = z.object({
    id: z.uuid()
})
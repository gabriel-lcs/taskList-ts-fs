import { Enum } from "../../../backend/src/schemas/tasksSchema";

export const Colors = {
            [Enum.EmAndamento]: "bg-yellow-200",
            [Enum.Concluido]: "bg-green-200",
            [Enum.Pendente]: "bg-red-200"
        }
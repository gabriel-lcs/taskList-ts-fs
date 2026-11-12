export enum Enum{
    Pendente = "Pendente",
    EmAndamento = "Em andamento",
    Concluido = "Concluido"
}

export const Colors = {
    [Enum.EmAndamento]: "bg-yellow-200",
    [Enum.Concluido]: "bg-green-200",
    [Enum.Pendente]: "bg-red-200"
}


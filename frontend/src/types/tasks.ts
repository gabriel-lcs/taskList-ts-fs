import {Enum} from "../../../backend/src/schemas/tasksSchema";

export type Task = {
        id: string;
        name: string;
        status: Enum;
    }
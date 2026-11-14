import {Enum} from "../enums/enums";

export type Task = {
    id: string;
    name: string;
    status: Enum;
    created_at: string;
}
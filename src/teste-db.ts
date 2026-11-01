import postgres from "postgres";

export const db = postgres({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD
})

const name = "Academia";

const insercao = await db`insert into tasks (name) values (${name}) returning *`

const consulta = await db`select id, name, status from tasks`

console.log(consulta)
console.log(insercao)

db.end()
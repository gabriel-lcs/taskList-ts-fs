import { describe, it, beforeEach, after } from "node:test";
import assert from "node:assert";
import { app } from "../app.js";
import { db } from "../database/database.js";
import z from "zod";

describe("teste", () => {
  beforeEach( async () => {
    await db`truncate table tasks;`
  })

  it("Lista vazia: quando não há tasks", async () => {
    const res = await app.inject({ method: "GET", url: "/tasks" })

    assert.strictEqual(res.statusCode, 200);
    assert.deepStrictEqual(res.json(), []);
  })

  it("POST/ cria uma task com status 'pendente' e devolve 201", async () => {
    const nomeEnviado = "Teste"

    const res = await app.inject({ method: "POST", url: "/tasks", payload: { name: nomeEnviado } })

    const data = res.json();

    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(data.name, nomeEnviado);
    assert.strictEqual(data.status, "Pendente");
    assert.ok(z.uuid().safeParse(data.id).success);

  })

  it("teste de get id que retorna 200", () => {

  })

  after(async () => {
    await app.close(); 
    await db.end();
  })
});
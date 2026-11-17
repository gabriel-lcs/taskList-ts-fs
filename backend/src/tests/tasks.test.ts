import { describe, it, beforeEach, after } from "node:test";
import assert from "node:assert";
import { randomUUID } from "node:crypto";
import z from "zod";
import { app } from "../app.js";
import { db } from "../database/database.js";
import type { Task } from "../schemas/tasksSchema.js";

async function criarTask(name = "Task de teste", status = "Pendente") {
  const [task] = await db<Task[]>`
    insert into tasks (name, status)
    values (${name}, ${status})
    returning *`;
  return task!;
}

describe("API /tasks", () => {
  beforeEach(async () => {
    await db`truncate table tasks`;
  });

  after(async () => {
    await app.close();
    await db.end();
  });

  describe("GET /tasks", () => {
    it("devolve 200 e lista vazia quando não há tasks", async () => {
      const res = await app.inject({ method: "GET", url: "/tasks" });

      assert.strictEqual(res.statusCode, 200);
      assert.deepStrictEqual(res.json(), []);
    });

    it("devolve as tasks ordenadas por created_at (mais antiga primeiro)", async () => {
      const primeira = await criarTask("Primeira");
      const segunda = await criarTask("Segunda");
      const terceira = await criarTask("Terceira");

      const res = await app.inject({ method: "GET", url: "/tasks" });
      const ids = res.json().map((t: Task) => t.id);

      assert.strictEqual(res.statusCode, 200);
      assert.deepStrictEqual(ids, [primeira.id, segunda.id, terceira.id]);
    });
  });

  describe("GET /tasks/:id", () => {
    it("devolve 200 e a task quando o id existe", async () => {
      const task = await criarTask("Buscar por id", "Em andamento");

      const res = await app.inject({ method: "GET", url: `/tasks/${task.id}` });
      const data = res.json();

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(data.id, task.id);
      assert.strictEqual(data.name, "Buscar por id");
      assert.strictEqual(data.status, "Em andamento");
    });

    it("devolve 400 quando o id não é um uuid", async () => {
      const res = await app.inject({ method: "GET", url: "/tasks/abc" });

      assert.strictEqual(res.statusCode, 400);
    });

    it("devolve 404 quando o uuid não existe", async () => {
      const res = await app.inject({ method: "GET", url: `/tasks/${randomUUID()}` });

      assert.strictEqual(res.statusCode, 404);
      assert.deepStrictEqual(res.json(), { error: "Not found" });
    });
  });

  describe("POST /tasks", () => {
    it("cria a task com status Pendente e devolve 201", async () => {
      const nomeEnviado = "Estudar Testes";

      const res = await app.inject({
        method: "POST",
        url: "/tasks",
        payload: { name: nomeEnviado },
      });
      const data = res.json();

      assert.strictEqual(res.statusCode, 201);
      assert.strictEqual(data.name, nomeEnviado);
      assert.strictEqual(data.status, "Pendente");
      assert.ok(z.uuid().safeParse(data.id).success);

      // prova que gravou de verdade no banco
      const linhas = await db<Task[]>`select * from tasks where id = ${data.id}`;
      assert.strictEqual(linhas.length, 1);
    });

    it("aceita nome com exatamente 3 letras", async () => {
      const res = await app.inject({
        method: "POST",
        url: "/tasks",
        payload: { name: "abc" },
      });

      assert.strictEqual(res.statusCode, 201);
    });

    it("devolve 400 com nome curto e não grava nada", async () => {
      const res = await app.inject({
        method: "POST",
        url: "/tasks",
        payload: { name: "ab" },
      });
      const data = res.json();

      assert.strictEqual(res.statusCode, 400);
      assert.ok(Array.isArray(data.error));
      assert.ok(
        data.error.some((issue: { path: unknown[] }) => issue.path.includes("name"))
      );

      const linhas = await db`select * from tasks`;
      assert.strictEqual(linhas.length, 0);
    });
  });

  describe("PATCH /tasks/:id", () => {
    it("muda só o nome e mantém o status", async () => {
      const task = await criarTask("Nome antigo", "Em andamento");

      const res = await app.inject({
        method: "PATCH",
        url: `/tasks/${task.id}`,
        payload: { name: "Nome novo" },
      });
      const data = res.json();

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(data.name, "Nome novo");
      assert.strictEqual(data.status, "Em andamento");

      const [linha] = await db<Task[]>`select * from tasks where id = ${task.id}`;
      assert.strictEqual(linha!.name, "Nome novo");
    });

    it("muda só o status e mantém o nome", async () => {
      const task = await criarTask("Mesmo nome", "Pendente");

      const res = await app.inject({
        method: "PATCH",
        url: `/tasks/${task.id}`,
        payload: { status: "Concluido" },
      });
      const data = res.json();

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(data.status, "Concluido");
      assert.strictEqual(data.name, "Mesmo nome");
    });

    it("devolve 400 com corpo vazio", async () => {
      const task = await criarTask();

      const res = await app.inject({
        method: "PATCH",
        url: `/tasks/${task.id}`,
        payload: {},
      });

      assert.strictEqual(res.statusCode, 400);
    });

    it("devolve 400 com status inválido", async () => {
      const task = await criarTask();

      const res = await app.inject({
        method: "PATCH",
        url: `/tasks/${task.id}`,
        payload: { status: "Feito" },
      });

      assert.strictEqual(res.statusCode, 400);
    });

    it("devolve 404 quando o id não existe", async () => {
      const res = await app.inject({
        method: "PATCH",
        url: `/tasks/${randomUUID()}`,
        payload: { name: "Qualquer nome" },
      });

      assert.strictEqual(res.statusCode, 404);
    });
  });

  describe("DELETE /tasks/:id", () => {
    it("apaga a task e depois ela devolve 404", async () => {
      const task = await criarTask();

      const res = await app.inject({ method: "DELETE", url: `/tasks/${task.id}` });
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.json().id, task.id);

      const depois = await app.inject({ method: "GET", url: `/tasks/${task.id}` });
      assert.strictEqual(depois.statusCode, 404);

      const linhas = await db`select * from tasks`;
      assert.strictEqual(linhas.length, 0);
    });

    it("devolve 404 quando o id não existe", async () => {
      const res = await app.inject({ method: "DELETE", url: `/tasks/${randomUUID()}` });

      assert.strictEqual(res.statusCode, 404);
    });

    it("devolve 400 quando o id não é um uuid", async () => {
      const res = await app.inject({ method: "DELETE", url: "/tasks/abc" });

      assert.strictEqual(res.statusCode, 400);
    });
  });
});

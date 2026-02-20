const request = require("supertest");
const { createApp } = require("../src/api/app");

describe("Route tests (200 / 404 / 500)", () => {
  let app;

  beforeAll(() => {
    process.env.NODE_ENV = "test";
    app = createApp();
  });

  test("GET /health -> 200", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  test("GET /ruta-que-no-existe -> 404 con JSON usable", async () => {
    const res = await request(app).get("/no-existe");
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error", "not_found");
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("path", "/no-existe");
  });

  test("GET /__test__/boom -> 500 con traceId", async () => {
    const res = await request(app)
      .get("/__test__/boom")
      .set("x-trace-id", "qa-123");

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error", "internal_error");
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("traceId", "qa-123");
  });
});

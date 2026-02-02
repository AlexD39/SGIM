const request = require("supertest");
const { createApp } = require("../api/app");

describe("JWT access control (public/private/roles)", () => {
  let app;

  beforeAll(() => {
    process.env.NODE_ENV = "test";
    process.env.JWT_SECRET = "test_secret";
    process.env.JWT_EXPIRES = "1h";
    app = createApp();
  });

  async function loginAs(email) {
    const res = await request(app)
      .post("/auth/login")
      .send({ email, password: "123456" });

    expect(res.status).toBe(200);
    return res.body.token;
  }

  test("Public: GET /health -> 200", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
  });

  test("Public: POST /auth/login -> 200 returns token", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "user@sgim.com", password: "123456" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("Private: GET /me sin token -> 401", async () => {
    const res = await request(app).get("/me");
    expect(res.status).toBe(401);
  });

  test("Private: GET /me con token -> 200", async () => {
    const token = await loginAs("user@sgim.com");
    const res = await request(app).get("/me").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("user");
  });

  test("Role: GET /admin/reports con user -> 403", async () => {
    const token = await loginAs("user@sgim.com");
    const res = await request(app).get("/admin/reports").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(403);
  });

  test("Role: GET /admin/reports con admin -> 200", async () => {
    const token = await loginAs("admin@sgim.com");
    const res = await request(app).get("/admin/reports").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  test("404: ruta inexistente -> 404", async () => {
    const res = await request(app).get("/no-existe");
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error", "not_found");
  });

  test("500: ruta boom -> 500", async () => {
    const res = await request(app).get("/__test__/boom").set("x-trace-id", "qa-001");
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("traceId", "qa-001");
  });
});

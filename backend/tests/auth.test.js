const request = require("supertest");
const { createApp } = require("../src/api/app");

const app = createApp();

let token1;
let token2;

describe("🔐 Auth Multisesión", () => {

  it("✅ Login debe funcionar", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({
        email: "admin@sgim.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();

    token1 = res.body.token;
  });

  it("✅ Segundo login (multisesión)", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({
        email: "admin@sgim.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(200);
    token2 = res.body.token;
  });

  it("📱 Debe listar sesiones", async () => {
    const res = await request(app)
      .get("/auth/sessions")
      .set("Authorization", `Bearer ${token1}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("🚪 Logout de una sesión", async () => {
    const res = await request(app)
      .post("/auth/logout")
      .set("Authorization", `Bearer ${token1}`);

    expect(res.statusCode).toBe(200);
  });

  it("❌ Token inválido después de logout", async () => {
    const res = await request(app)
      .get("/auth/sessions")
      .set("Authorization", `Bearer ${token1}`);

    expect(res.statusCode).toBe(401);
  });

  it("💥 Logout-all invalida todas", async () => {
    const res = await request(app)
      .post("/auth/logout-all")
      .set("Authorization", `Bearer ${token2}`);

    expect(res.statusCode).toBe(200);
  });

  it("❌ Token2 también inválido", async () => {
    const res = await request(app)
      .get("/auth/sessions")
      .set("Authorization", `Bearer ${token2}`);

    expect(res.statusCode).toBe(401);
  });

});
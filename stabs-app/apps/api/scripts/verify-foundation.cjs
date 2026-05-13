require("reflect-metadata");

const { NestFactory } = require("@nestjs/core");
const { AppModule } = require("../dist/app.module.js");

async function verify() {
  const app = await NestFactory.create(AppModule, { logger: false });
  app.setGlobalPrefix("api");
  app.enableCors();
  await app.listen(0);

  const address = app.getHttpServer().address();
  const baseUrl = `http://127.0.0.1:${address.port}/api`;

  const loginResponse = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ username: "admin", password: "demo" })
  });

  const login = await loginResponse.json();

  if (loginResponse.status !== 201 || !login.token) {
    throw new Error("Login-Verifikation fehlgeschlagen.");
  }

  const meResponse = await fetch(`${baseUrl}/auth/me`, {
    headers: { authorization: `Bearer ${login.token}` }
  });
  const me = await meResponse.json();

  if (meResponse.status !== 200 || !Array.isArray(me.permissions)) {
    throw new Error("Sitzungs- und Rechteverifikation fehlgeschlagen.");
  }

  const incidentsResponse = await fetch(`${baseUrl}/incidents`);
  const incidents = await incidentsResponse.json();

  if (incidentsResponse.status !== 200 || !Array.isArray(incidents)) {
    throw new Error("Lageverifikation fehlgeschlagen.");
  }

  console.log(
    JSON.stringify(
      {
        status: "ok",
        checks: {
          login: loginResponse.status,
          me: meResponse.status,
          incidents: incidentsResponse.status
        }
      },
      null,
      2
    )
  );

  await app.close();
}

verify().catch((error) => {
  console.error(error);
  process.exit(1);
});

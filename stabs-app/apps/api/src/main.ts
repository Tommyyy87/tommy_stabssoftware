import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { getRuntimeBinding } from "./runtime-config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  app.enableCors();

  const { host, port } = getRuntimeBinding(process.env);

  await app.listen(port, host);
  console.log(`API listening on ${host}:${port}`);
}

void bootstrap();

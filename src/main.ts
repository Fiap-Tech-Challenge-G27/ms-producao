import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle("API")
    .setDescription("Restaurant Management System API ")
    .setVersion("1.0")
    .addTag("API")
    .build();


  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, document);

  await app.listen(3000, "0.0.0.0");
}
bootstrap();

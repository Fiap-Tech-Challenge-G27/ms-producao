import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PostgresConfigServiceService } from "@infra/typeorm/postgres.service";

import { CategoriesModule } from "@categories/categories.module";
import { HealthModule } from "@modules/health/health.module";
import { OrdersModule } from "@orders/orders.module";
import { ProductsModule } from "@products/products.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: PostgresConfigServiceService,
    }),
    CategoriesModule,
    ProductsModule,
    OrdersModule,
    HealthModule,
  ],
  providers: [PostgresConfigServiceService],
})
export class AppModule {}

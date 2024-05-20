import { Category } from "@modules/categories/infra/typeorm/entities/category";
import { Order } from "@modules/orders/infra/typeorm/entities/order";
import { OrdersProductsAmounts } from "@modules/orders/infra/typeorm/entities/orders-products-amounts";
import { Product } from "@modules/products/infra/typeorm/entities/product";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { TypeOrmModuleOptions } from "@nestjs/typeorm/dist";

@Injectable()
export class PostgresConfigServiceService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) { }

  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    return {
      type: "postgres",
      url: this.configService.get("TYPEORM_URL"),
      entities: [ Product, Order, Category, OrdersProductsAmounts],
      synchronize: true
    };
  }
}

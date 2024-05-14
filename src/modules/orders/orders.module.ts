import { Module } from "@nestjs/common";
import { OrdersController } from "./controller/orders.controller";
import { IOrderRepository } from "./core/order-repository.abstract";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "@orders/infra/typeorm/entities/order";
import { OrderRepository } from "@orders/infra/typeorm/repositories/orders.repository";
import { IProductRepository } from "../products/core/product-repository.abstract";
import { ProductRepository } from "@products/infra/typeorm/repositories/product.repository";
import { OrdersProductsAmounts } from "@orders/infra/typeorm/entities/orders-products-amounts";
import { Category } from "@categories/infra/typeorm/entities/category";
import { Product } from "@products/infra/typeorm/entities/product";
import { ExceptionsService } from "@shared/infra/exceptions/exceptions.service";
import { IExceptionService } from "src/shared/exceptions/exceptions.interface";
import { OrderMapper } from "@orders/core/mappers/order.mapper";
import { OrderProductMapper } from "@orders/core/mappers/order-product.mapper";
import { CreateOrderUseCase } from "./use-cases/create-order.usecase";
import { FindAllOrdersUseCase } from "./use-cases/find-all-orders.usecase";
import { FindOrderUseCase } from "./use-cases/find-order.usecase";
import { UpdateOrderUseCase } from "./use-cases/update-order.usecase";
import { ConfirmatePaymentUseCase } from "./use-cases/confimate-payment.usecase";
import { IPaymentGateway } from "./core/payment-gateway";
import { PaymentGateway } from "./infra/typeorm/thirdParties/payment-gateway";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrdersProductsAmounts,
      Category,
      Product,
    ]),
    JwtModule,
  ],
  controllers: [OrdersController],
  providers: [
    {
      provide: IOrderRepository,
      useClass: OrderRepository,
    },
    {
      provide: IProductRepository,
      useClass: ProductRepository,
    },
    {
      provide: IExceptionService,
      useClass: ExceptionsService,
    },
    {
      provide: IPaymentGateway,
      useClass: PaymentGateway,
    },
    OrderMapper,
    OrderProductMapper,
    CreateOrderUseCase,
    FindAllOrdersUseCase,
    FindOrderUseCase,
    UpdateOrderUseCase,
    ConfirmatePaymentUseCase,
  ],
})
export class OrdersModule {}

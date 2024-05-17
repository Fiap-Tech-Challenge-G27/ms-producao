import { Category } from "@categories/infra/typeorm/entities/category";
import { Module, Provider } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderProductMapper } from "@orders/core/mappers/order-product.mapper";
import { OrderMapper } from "@orders/core/mappers/order.mapper";
import { Order } from "@orders/infra/typeorm/entities/order";
import { OrdersProductsAmounts } from "@orders/infra/typeorm/entities/orders-products-amounts";
import { OrderRepository } from "@orders/infra/typeorm/repositories/orders.repository";
import { Product } from "@products/infra/typeorm/entities/product";
import { ProductRepository } from "@products/infra/typeorm/repositories/product.repository";
import { IExceptionService } from "@shared/exceptions/exceptions.interface";
import { ExceptionsService } from "@shared/infra/exceptions/exceptions.service";
import { IProductRepository } from "../products/core/product-repository.abstract";
import { OrdersController } from "./controller/orders.controller";
import { IOrderRepository } from "./core/order-repository.abstract";
import { IPaymentGateway } from "./core/payment-gateway";
import { PaymentGateway } from "./infra/typeorm/thirdParties/payment-gateway";
import { ConfirmatePaymentUseCase } from "./use-cases/confimate-payment.usecase";
import { CreateOrderUseCase } from "./use-cases/create-order.usecase";
import { FindAllOrdersUseCase } from "./use-cases/find-all-orders.usecase";
import { FindOrderUseCase } from "./use-cases/find-order.usecase";
import { UpdateOrderUseCase } from "./use-cases/update-order.usecase";

const basicProductModuleMetadata = {
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
  ] as Array<Provider>,
};

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrdersProductsAmounts, Category, Product]),
    JwtModule,
  ],
  ...basicProductModuleMetadata,
})
class OrdersModule {}

export { OrdersModule, basicProductModuleMetadata };

import { Inject, Injectable } from "@nestjs/common";
import { IProductRepository } from "@products/core/product-repository.abstract";
import { UseCase } from "@shared/core/use-case";
import { IExceptionService } from "@shared/exceptions/exceptions.interface";
import { OrderProductMapper } from "../core/mappers/order-product.mapper";
import { OrderMapper } from "../core/mappers/order.mapper";
import { IOrderRepository } from "../core/order-repository.abstract";
import { OrderProductEntity } from "../core/order.entity";
import { IPaymentGateway } from "../core/payment-gateway";
import { CreateOrderDto, OrderProducts } from "../dtos/create-order.dto";

@Injectable()
export class CreateOrderUseCase implements UseCase {
  constructor(
    @Inject(IExceptionService)
    private readonly exceptionService: IExceptionService,
    @Inject(IPaymentGateway)
    private readonly paymentGateway: IPaymentGateway,
    private readonly orderMapper: OrderMapper,
    private readonly orderProductMapper: OrderProductMapper,
    @Inject(IProductRepository)
    private readonly productRepository: IProductRepository,
    @Inject(IOrderRepository)
    private readonly orderRepository: IOrderRepository,
  ) {}

  private async getOrderProducts(
    orderProducts: OrderProducts[],
  ): Promise<OrderProductEntity[]> {
    const orderProdutsEntity = orderProducts.map(
      async ({ productId, amount }) => {
        const product = await this.productRepository.findOne(productId);
        return this.orderProductMapper.mapFrom({ product, amount });
      },
    );

    return await Promise.all(orderProdutsEntity);
  }

  async execute(createOrderDto: CreateOrderDto, customerId: string) {
    const { orderProducts } = createOrderDto;

    if (!orderProducts.length) {
      this.exceptionService.badRequestException({
        message: "Order products is empty",
        code: 400,
      });
    }
    const orderProductsEntity = await this.getOrderProducts(orderProducts);
    
    const order = this.orderMapper.mapFrom({
      customerId,
      orderProductsEntity,
    });
    
    const result = await this.orderRepository.create(order);
    await this.paymentGateway.create(result.id);
    
    return result;
  }
}

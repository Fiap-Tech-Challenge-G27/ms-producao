import {
  OrderEntity,
  OrderProductEntity,
  OrderState,
  PaymentState,
} from "../core/order.entity";
import { ProductEntity } from "@modules/products/core/product.entity";
import { customerMother } from "./customerId.mother";
import { CreateOrderDto, OrderProducts } from "../dtos/create-order.dto";
import { randomEntityDates, randomId } from "@shared/tests/random";

export class OrderProxy extends OrderEntity {
  public constructor(orderProduct: Array<[ProductEntity, number]>) {
    let orderProducts = orderProduct.map(
      ([project, number]) => new OrderProductEntity(project, number)
    );

    super(
      customerMother.customer.id,
      orderProducts,
      OrderState.Received,
      PaymentState.Pending
    );

    for (let orderProductAmount of this.orderProductsAmounts) {
      orderProductAmount.order = this;
    }

    const { createdAt, updatedAt } = randomEntityDates();
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public asCreateDTO() {
    return {
      orderProducts: this.orderProductsAmounts.map(
        (entity) =>
          <OrderProducts>{
            productId: entity.product.id,
            amount: entity.amount,
          }
      ),
    } as CreateOrderDto;
  }

  public withId() {
    let result = this.clone();
    result.id = randomId();
    return result;
  }

  public withoutOrderProductsAmounts() {
    let result = this.clone();
    result.orderProductsAmounts = undefined;
    return result;
  }

  public clone(): OrderProxy {
    const result: OrderProxy = Object.assign(Object.create(this), this);

    result.orderProductsAmounts = result.orderProductsAmounts.map(
      (orderProductEntity) => new OrderProductEntity(orderProductEntity.product, orderProductEntity.amount, result)
    );

    return result
  }
}

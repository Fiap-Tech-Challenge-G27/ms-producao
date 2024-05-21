import { ProductEntity } from "@modules/products/core/product.entity";
import { randomEntityDates, randomId } from "@shared/tests/random";
import {
  OrderEntity,
  OrderProductEntity,
  OrderState,
  PaymentState,
} from "../core/order.entity";
import { CreateOrderDto, OrderProducts } from "../dtos/create-order.dto";
import { customerMother } from "./customerId.mother";

export class OrderProxy extends OrderEntity {
  public constructor(
    orderProduct: Array<[ProductEntity, number]>,
    state: OrderState,
    paymentState: PaymentState,
    createdAt: Date,
    updatedAt: Date = undefined
  ) {
    let orderProducts = orderProduct.map(
      ([project, number]) => new OrderProductEntity(project, number)
    );

    super(customerMother.customer.id, orderProducts, state, paymentState);

    for (let orderProductAmount of this.orderProductsAmounts) {
      orderProductAmount.order_id = this.id;
    }

    const defaultDates = randomEntityDates(createdAt);
    this.createdAt = createdAt;
    this.updatedAt = updatedAt || defaultDates.updatedAt;
  }

  public asCreateDTO() {
    return {
      orderProducts: this.orderProductsAmounts.map(
        (entity) =>
          <OrderProducts>{
            productId: entity.product_id,
            amount: entity.amount,
          }
      ),
    } as CreateOrderDto;
  }

  public withOrderProductsAsUnderfined() {
    let result = this.clone();

    result.orderProductsAmounts = this.orderProductsAmounts.map(
      (_) => undefined
    );

    return result;
  }

  public withIdUnderfined() {
    let result = this.clone();
    result.id = undefined;
    return result
  }

  public withRandomId() {
    let result = this.clone();
    result.id = randomId();
    return result;
  }

  public withoutOrderProductsAmounts() {
    let result = this.clone();
    result.orderProductsAmounts = [];
    return result;
  }

  public withState(state: OrderState) {
    let result = this.clone();
    result.state = state;
    return result;
  }
  public withPaymentState(paymentState: PaymentState) {
    let result = this.clone();
    result.paymentState = paymentState;
    return result;
  }

  public clone(): OrderProxy {
    const result: OrderProxy = Object.assign(Object.create(this), this);

    result.orderProductsAmounts = result.orderProductsAmounts.map(
      (orderProductEntity) =>
        new OrderProductEntity(
          { id: orderProductEntity.product_id } as any,
          orderProductEntity.amount,
          result
        )
    );

    return result;
  }
}

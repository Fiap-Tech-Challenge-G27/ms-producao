import { ProductEntity } from "@products/core/product.entity";
import { Entity } from "@shared/core/entity";
import { Order } from "../infra/typeorm/entities/order";

export enum OrderState {
  Received = "Received",
  InPreparation = "InPreparation",
  Done = "Done",
  Finished = "Finished",
}

export enum PaymentState {
  Pending = "Pending",
  Approved = "Approved",
  Canceled = "Canceled",
}

export class OrderProductEntity extends Entity {
  order: OrderEntity;
  product: ProductEntity;
  amount: number;

  constructor(product: ProductEntity, amount: number, order?: Order) {
    super();
    this.product = product;
    this.amount = amount;
    this.order = order;
  }
}
export class OrderEntity extends Entity {
  customerId: string;
  orderProductsAmounts: OrderProductEntity[];
  state: OrderState;
  paymentState: PaymentState;

  id: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    customerId: string,
    orderProductsAmounts: OrderProductEntity[],
    state: OrderState = OrderState.Received,
    paymentState: PaymentState = PaymentState.Pending
  ) {
    super();
    for (let orderProductAmount of orderProductsAmounts) {
      orderProductAmount.order = this;
    }

    this.customerId = customerId;
    this.orderProductsAmounts = orderProductsAmounts;
    this.state = state;
    this.paymentState = paymentState;
  }
}

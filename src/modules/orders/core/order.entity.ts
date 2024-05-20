import { Product } from "@modules/products/infra/typeorm/entities/product";
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
  amount: number;

  order_id: string;
  product_id: string;

  order: Order = undefined
  product: Product = undefined

  constructor(product: ProductEntity, amount: number, order?: Order) {
    super();
    this.amount = amount;

    if(order) {
      this.order_id = order.id;
    }
    this.product_id = product.id;
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

    this.customerId = customerId;
    this.orderProductsAmounts = orderProductsAmounts;
    this.state = state;
    this.paymentState = paymentState;
  }
}

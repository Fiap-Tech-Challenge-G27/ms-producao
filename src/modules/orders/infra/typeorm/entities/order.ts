import { OrderState, PaymentState } from "@orders/core/order.entity";
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { OrdersProductsAmounts } from "./orders-products-amounts";

@Entity({ name: "orders" })
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToMany(
    /* istanbul ignore next */
    () => OrdersProductsAmounts,
    /* istanbul ignore next */
    (order_product_amount) => order_product_amount.order
  )
  orderProductsAmounts: OrdersProductsAmounts[];

  @Column({
    type: "enum",
    enum: OrderState,
  })
  state: OrderState;

  @Column({
    type: "enum",
    enum: PaymentState,
    nullable: true,
  })
  paymentState: PaymentState;

  @Column({ type: "uuid" })
  customerId: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;
}

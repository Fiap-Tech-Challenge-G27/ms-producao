import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { OrdersProductsAmounts } from "./orders-products-amounts";
import { OrderState, PaymentState } from "@orders/core/order.entity";

@Entity({ name: "orders" })
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToMany(
    () => OrdersProductsAmounts,
    (order_product_amount) => order_product_amount.order,
  )
  orders_products_amounts: OrdersProductsAmounts[];

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
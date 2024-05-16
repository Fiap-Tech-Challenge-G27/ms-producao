import { Product } from "@products/infra/typeorm/entities/product";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Order } from "./order";

@Entity({ name: "orders_products" })
export class OrdersProductsAmounts {
  @PrimaryColumn("uuid")
  @ManyToOne(() => Order, (order) => order.orderProductsAmounts, {
    cascade: true,
  })
  @JoinColumn({ name: "order_id" })
  order: Order;

  @PrimaryColumn("uuid")
  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: "product_id" })
  product: Product;

  @Column({ name: "amount", type: "int", nullable: false })
  amount: number;
}

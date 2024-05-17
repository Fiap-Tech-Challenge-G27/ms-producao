import { Mapper } from "@shared/core/mapper";
import { OrderEntity, OrderProductEntity } from "../order.entity";

export class OrderMapper extends Mapper<
  { customerId: string; orderProductsEntity: OrderProductEntity[] },
  OrderEntity
> {
  mapFrom(param: {
    customerId: string;
    orderProductsEntity: OrderProductEntity[];
  }): OrderEntity {
    const { customerId, orderProductsEntity } = param;
    const order = new OrderEntity(customerId, orderProductsEntity);
    return order;
  }
}

import { OrderEntity, OrderProductEntity } from "../order.entity";
import { Mapper } from "@shared/core/mapper";

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

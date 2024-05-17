import { ProductEntity } from "@products/core/product.entity";
import { Mapper } from "@shared/core/mapper";
import { OrderProductEntity } from "../order.entity";

export class OrderProductMapper extends Mapper<
  { product: ProductEntity; amount: number },
  OrderProductEntity
> {
  mapFrom(param: {
    product: ProductEntity;
    amount: number;
  }): OrderProductEntity {
    const { product, amount } = param;
    const orderProduct = new OrderProductEntity(product, amount);

    return orderProduct;
  }
}

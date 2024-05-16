import { productMother } from "@modules/products/tests/products.mother";
import { OrderProxy } from "./orders.proxy";
import { OrderState, PaymentState } from "../core/order.entity";

export const orderMother = {
  sugar_overdose: new OrderProxy(
    [
      [productMother.cake, 10],
      [productMother.pudding, 20],
    ],
    OrderState.Received,
    PaymentState.Pending
  ),
  dinner: new OrderProxy(
    [
      [productMother.bigMac, 2],
      [productMother.whopper, 1],
    ],
    OrderState.InPreparation,
    PaymentState.Approved
  ),
  finished: new OrderProxy(
    [
      [productMother.bigMac, 2],
      [productMother.whopper, 1],
      [productMother.cake, 3],
      [productMother.pudding, 1]
    ],
    OrderState.Finished,
    PaymentState.Approved
  )
};

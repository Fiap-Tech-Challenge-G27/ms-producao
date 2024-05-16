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
    PaymentState.Pending,
    new Date("2023-01-01")
  ),
  dinner: new OrderProxy(
    [
      [productMother.bigMac, 2],
      [productMother.whopper, 1],
    ],
    OrderState.InPreparation,
    PaymentState.Approved,
    new Date("2022-01-01")
  ),
  lunch: new OrderProxy(
    [
      [productMother.bigMac, 2],
      [productMother.whopper, 1],
    ],
    OrderState.InPreparation,
    PaymentState.Approved,
    new Date("2021-01-01")
  ),
  finished: new OrderProxy(
    [
      [productMother.bigMac, 2],
      [productMother.whopper, 1],
      [productMother.cake, 3],
      [productMother.pudding, 1]
    ],
    OrderState.Finished,
    PaymentState.Approved,
    new Date("2020-01-01")
  )
};

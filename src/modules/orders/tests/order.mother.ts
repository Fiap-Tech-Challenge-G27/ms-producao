import { productMother } from "@modules/products/tests/products.mother";
import { OrderProxy } from "./orders.proxy";

export const orderMother = {
  sugar_overdose: new OrderProxy([
    [productMother.cake, 10],
    [productMother.pudding, 20],
  ]),
};

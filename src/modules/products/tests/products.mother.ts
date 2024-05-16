import { categoryMother } from "@modules/categories/tests/category.mother";
import { Product } from "../infra/typeorm/entities/product";
import { ProductProxy } from "./products.proxy";

export const productMother = {
  cake: new ProductProxy(
    "cake",
    "an item of soft, sweet food made from a mixture of flour, shortening, eggs, sugar, and other ingredients, baked and often decorated.",
    categoryMother.dessert
  ),
  pudding: new ProductProxy(
    "pudding",
    "a sweet or savory steamed dish made with flour.",
    categoryMother.dessert
  ),

  bigMac: new ProductProxy(
    "Big Mac ®",
    "The McDonald's Big Mac® is a 100% beef burger with a taste like no other.",
    categoryMother.hamburger
  ),
  whopper: new ProductProxy(
    "Whopper ®",
    "A flame-grilled beef patty, topped with tomatoes, fresh cut lettuce, mayo, pickles, a swirl of ketchup, and sliced onions...",
    categoryMother.hamburger
  )
};

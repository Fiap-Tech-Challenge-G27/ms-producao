import { CategoryProxy } from "./category.prototype";

export const categoryMother = {
  dessert: new CategoryProxy("dessert", "sweets and cake"),
  hamburger: new CategoryProxy(
    "hamburger",
    "bread, hamburguer and other things"
  ),
};

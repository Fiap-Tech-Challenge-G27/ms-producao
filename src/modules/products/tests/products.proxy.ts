import {
  randomEntityDates,
  randomFloat,
  randomId,
  randomInt,
} from "@shared/tests/random";
import { ProductEntity } from "../core/product.entity";
import { CategoryEntity } from "@modules/categories/core/category.entity";

export class ProductProxy extends ProductEntity {
  constructor(name: string, description: string, category: CategoryEntity) {
    const price = randomFloat(0, 10);
    const quantity = randomInt(0, 100);
    const status = "active";
    const id = randomId();

    const { createdAt, updatedAt } = randomEntityDates();

    super(
      name,
      description,
      price,
      quantity,
      status,
      category,
      id,
      createdAt,
      updatedAt
    );
  }

  public asCreateDTO() {
    return {
      name: this.name,
      description: this.description,
      categoryId: this.category.id,
      price: this.price,
      quantity: this.quantity,
      status: this.status,
    };
  }

  public withDescription(description: string) {
    let result = this.clone();
    result.description = description;
    return result;
  }

  public softDeleted() {
    let result = this.clone()
    result.deletedAt = Date.now()
    return result
  }

  public clone() {
    return Object.assign(Object.create(this), this);
  }
}

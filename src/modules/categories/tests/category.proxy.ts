import { randomId, randomEntityDates } from "@shared/tests/random";
import { v4 as uuidv4 } from "uuid";
import { CategoryEntity } from "../core/category.entity";
import { Category } from "../infra/typeorm/entities/category";
import { CreateCategoryDto } from "../dtos/create-category.dto";
import { ProductEntity } from "@modules/products/core/product.entity";

export class CategoryProxy extends CategoryEntity {
  public constructor(name: string, description: string) {
    super(name, name + " (slug)", description);

    this.id = randomId();

    const { createdAt, updatedAt } = randomEntityDates();
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;

    this.products = [];
  }

  public asCreateDTO() {
    return {
      name: this.name,
      slug: this.slug,
      description: this.description,
    } as CreateCategoryDto;
  }

  public withDescription(description: string) {
    let result = this.clone();
    result.description = description;
    return result;
  }

  public withProducts(productMother: object) {
    let result = this.clone();
    result.products = this.cloneProducts(Object.values(productMother), result);

    return result;
  }

  public clone(): CategoryProxy {
    let result: CategoryProxy = Object.assign(Object.create(this), this);
    result.products = this.cloneProducts(result.products, result);
    return result;
  }

  private cloneProducts(products: Array<any>, newCategory: CategoryProxy) {
    return products
      .filter((product) => product.category.id == this.id)
      .map((product) => product.clone(newCategory));
  }
}

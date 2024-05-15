import { randomId, randomEntityDates } from "@shared/tests/random";
import { v4 as uuidv4 } from "uuid";
import { CategoryEntity } from "../core/category.entity";
import { Category } from "../infra/typeorm/entities/category";
import { CreateCategoryDto } from "../dtos/create-category.dto";

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

  public withSlug(slug: string) {
    let result = this.clone();
    result.slug = slug;
    return result;
  }

  public clone() {
    return Object.assign(Object.create(this), this)
  }
}

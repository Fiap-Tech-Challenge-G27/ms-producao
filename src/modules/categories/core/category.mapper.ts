import { Mapper } from "@shared/core/mapper";
import { CreateCategoryDto } from "../dtos/create-category.dto";
import { UpdateCategoryDto } from "../dtos/update-category.dto";
import { CategoryEntity } from "./category.entity";

export class CategoryMapper extends Mapper<
  CreateCategoryDto | UpdateCategoryDto,
  CategoryEntity
> {
  public mapFrom(
    dataDto: CreateCategoryDto | UpdateCategoryDto,
  ): CategoryEntity {
    const category = new CategoryEntity(
      dataDto.name,
      dataDto.slug,
      dataDto.description,
    );
    return category;
  }
}

import { Inject, Injectable } from "@nestjs/common";
import { UseCase } from "@shared/core/use-case";
import { IExceptionService } from "@shared/exceptions/exceptions.interface";
import { ICategoryRepository } from "../core/category-repository.abstract";
import { CategoryMapper } from "../core/category.mapper";
import { UpdateCategoryDto } from "../dtos/update-category.dto";

@Injectable()
export class UpdateCategoryUseCase implements UseCase {
  constructor(
    private readonly categoryRepository: ICategoryRepository,
    @Inject(IExceptionService)
    private readonly exceptionService: IExceptionService,
    private readonly categoryMapper: CategoryMapper,
  ) {}

  async execute(id: string, updateCategoryDto: UpdateCategoryDto) {
    const { slug } = updateCategoryDto;

    const categoryExists = await this.categoryRepository.findOne(id, "id");

    if (!categoryExists) {
      this.exceptionService.notFoundException({
        message: "Category not found",
        code: 404,
      });
    }

    const slugAlreadyExists = await this.categoryRepository.findOne(
      slug,
      "slug",
    );

    if (slugAlreadyExists && slugAlreadyExists.id !== id) {
      this.exceptionService.badRequestException({
        message: "Category already exists with this slug",
        code: 400,
      });
    }

    const category = this.categoryMapper.mapFrom(updateCategoryDto);

    const updatedCategory = await this.categoryRepository.update(id, category);

    return updatedCategory;
  }
}

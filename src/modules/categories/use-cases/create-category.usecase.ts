import { Inject, Injectable } from "@nestjs/common";
import { UseCase } from "@shared/core/use-case";
import { IExceptionService } from "@shared/exceptions/exceptions.interface";
import { ICategoryRepository } from "../core/category-repository.abstract";
import { CategoryMapper } from "../core/category.mapper";
import { CreateCategoryDto } from "../dtos/create-category.dto";

@Injectable()
export class CreateCategoryUseCase implements UseCase {
  constructor(
    @Inject(ICategoryRepository)
    private readonly categoryRepository: ICategoryRepository,
    private readonly categoryMapper: CategoryMapper,
    @Inject(IExceptionService)
    private readonly exceptionService: IExceptionService,
  ) {}

  async execute(createCategoryDto: CreateCategoryDto) {
    const { slug } = createCategoryDto;

    const categoryAlreadyExists = await this.categoryRepository.findOne(
      slug,
      "slug",
    );

    if (categoryAlreadyExists) {
      this.exceptionService.badRequestException({
        message: "Category already exists with this slug",
        code: 400,
      });
    }

    const category = this.categoryMapper.mapFrom(createCategoryDto);

    const createdCategory = await this.categoryRepository.create(category);

    return createdCategory;
  }
}

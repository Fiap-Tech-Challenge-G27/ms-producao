import { Category } from "@categories/infra/typeorm/entities/category";
import { CategoryRepository } from "@categories/infra/typeorm/repositories/category.repository";
import { Module, Provider } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IExceptionService } from "@shared/exceptions/exceptions.interface";
import { ExceptionsService } from "@shared/infra/exceptions/exceptions.service";
import { CategoriesController } from "./controller/categories.controller";
import { ICategoryRepository } from "./core/category-repository.abstract";
import { CategoryMapper } from "./core/category.mapper";
import {
    CreateCategoryUseCase,
    FindAllCategoriesUseCase,
    FindCategoryUseCase,
    UpdateCategoryUseCase,
} from "./use-cases";

const basicCategoriesModuleMetadata = {
  controllers: [CategoriesController],
  providers: [
    {
      provide: ICategoryRepository,
      useClass: CategoryRepository,
    },
    {
      provide: IExceptionService,
      useClass: ExceptionsService,
    },
    CategoryMapper,
    CreateCategoryUseCase,
    UpdateCategoryUseCase,
    FindAllCategoriesUseCase,
    FindCategoryUseCase,
  ] as Array<Provider>,
};

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  ...basicCategoriesModuleMetadata,
})
class CategoriesModule {}

export { CategoriesModule, basicCategoriesModuleMetadata };


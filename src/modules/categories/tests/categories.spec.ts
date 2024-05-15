import { Test, TestingModule } from "@nestjs/testing";
import { CategoriesController } from "../controller/categories.controller";
import { CategoryRepository } from "../infra/typeorm/repositories/category.repository";
import { ICategoryRepository } from "../core/category-repository.abstract";
import { ExceptionsService } from "@infra/exceptions/exceptions.service";
import { IExceptionService } from "@shared/exceptions/exceptions.interface";
import { CategoryMapper } from "../core/category.mapper";
import {
  CreateCategoryUseCase,
  FindAllCategoriesUseCase,
  FindCategoryUseCase,
  UpdateCategoryUseCase,
} from "../use-cases";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoryEntity } from "../core/category.entity";
import { Category } from "../infra/typeorm/entities/category";
import { Product } from "@modules/products/infra/typeorm/entities/product";

describe("Categories", () => {
  let categoriesController: CategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      imports: [
        TypeOrmModule.forRoot({
          type: "better-sqlite3",
          database: ":memory:",
          dropSchema: true,
          entities: [Category, Product],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Category, Product]),
      ],
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
      ],
    }).compile();

    categoriesController =
      module.get<CategoriesController>(CategoriesController);
  });

  it("", async () => {});
});

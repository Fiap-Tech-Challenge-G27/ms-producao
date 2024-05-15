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
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CreateCategoryDto } from "../dtos/create-category.dto";

describe("/categories", () => {
  let categoriesController: CategoriesController;
  let repositoryMock: Repository<Category>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: getRepositoryToken(Category),
          useClass: Repository,
        },
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
    repositoryMock = module.get<Repository<Category>>(
      getRepositoryToken(Category)
    );
  });

  it("should be defined", () => {
    expect(categoriesController).toBeDefined();
  });

  describe("/create", () => {
    it("should call the repository", async () => {

      const createCategoryDto = {
        name: "dessert",
        slug: "dessert",
        description: "sweets and cakes",
      }

      const category = {
        ...createCategoryDto,
        createdAt: new Date("2019-01-16"),
        updatedAt: new Date("2019-01-16"),
        products: undefined,
        id: undefined
      }

      jest.spyOn(repositoryMock, "save").mockResolvedValueOnce(category);
      jest.spyOn(repositoryMock, "findOne").mockReturnValueOnce(null)      

      const response = await categoriesController.create(createCategoryDto as CreateCategoryDto);

      expect(response).toEqual(category)
      expect(response.constructor).toBe(CategoryEntity)     
    });
  });
});

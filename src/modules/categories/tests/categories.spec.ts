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
import { Repository, UpdateResult } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CreateCategoryDto } from "../dtos/create-category.dto";
import { CategoryProxy } from "./category.prototype";
import { categoryMother } from "./category.mother";
import { BadRequestException } from "@nestjs/common/exceptions/bad-request.exception";
import {
  basicCategoriesModuleAttributes,
  CategoriesModule,
} from "../categories.module";

describe("/categories", () => {
  let categoriesController: CategoriesController;
  let repositoryMock: Repository<Category>;

  let moduleMetadata = { ...basicCategoriesModuleAttributes };
  moduleMetadata.providers.push({
    provide: getRepositoryToken(Category),
    useClass: Repository,
  });

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule(moduleMetadata).compile();

    categoriesController =
      module.get<CategoriesController>(CategoriesController);
    repositoryMock = module.get<Repository<Category>>(
      getRepositoryToken(Category)
    );
  });

  it("should be defined", () => {
    expect(categoriesController).toBeDefined();
  });

  describe("POST", () => {
    it("should create when don't exists", async () => {
      const category = categoryMother.dessert;

      jest.spyOn(repositoryMock, "save").mockResolvedValueOnce(category);
      jest.spyOn(repositoryMock, "findOne").mockResolvedValueOnce(null);

      const response = await categoriesController.create(
        category.asCreateDTO()
      );

      expect(response).toEqual(category);
    });

    it("should error when exists", async () => {
      const category = categoryMother.dessert;

      jest.spyOn(repositoryMock, "save").mockResolvedValueOnce(category);
      jest.spyOn(repositoryMock, "findOne").mockResolvedValueOnce(category);

      expect(
        async () => await categoriesController.create(category.asCreateDTO())
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("GET", () => {
    it("should return all categories", async () => {
      const categories = [categoryMother.dessert, categoryMother.hamburger];

      jest.spyOn(repositoryMock, "find").mockResolvedValueOnce(categories);

      const response = await categoriesController.findAll();

      expect(response).toEqual(categories);
    });
  });

  describe("GET /:slug", () => {
    it("should return if exists", async () => {
      const category = categoryMother.dessert;
      jest.spyOn(repositoryMock, "findOne").mockResolvedValueOnce(category);

      const response = await categoriesController.findOne(category.slug);

      expect(response).toEqual(category);
    });

    it("should error if not exists", async () => {
      const category = categoryMother.dessert;
      jest.spyOn(repositoryMock, "findOne").mockResolvedValueOnce(null);

      expect(
        async () => await categoriesController.findOne(category.slug)
      ).rejects.toThrow("Category not found");
    });
  });

  describe("POST /:id", () => {
    it("should update when OK", async () => {
      const category = categoryMother.dessert;
      const description = "updated description";
      const updatedCategory = category.withDescription(description);

      jest.spyOn(repositoryMock, "findOne").mockResolvedValue(category);
      jest.spyOn(repositoryMock, "save").mockResolvedValue(updatedCategory);

      const response = await categoriesController.update(category.id, {
        description,
      });

      expect(response).toEqual(updatedCategory);
    });
  });
});

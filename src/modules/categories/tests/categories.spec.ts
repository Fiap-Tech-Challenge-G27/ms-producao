import { BadRequestException } from "@nestjs/common/exceptions/bad-request.exception";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { basicCategoriesModuleMetadata } from "../categories.module";
import { CategoriesController } from "../controller/categories.controller";
import { Category } from "../infra/typeorm/entities/category";
import { categoryMother } from "./category.mother";

describe("/categories", () => {
  let categoriesController: CategoriesController;
  let repositoryMock: Repository<Category>;

  let moduleMetadata = { ...basicCategoriesModuleMetadata };
  moduleMetadata.providers = [
    ...moduleMetadata.providers,
    {
      provide: getRepositoryToken(Category),
      useClass: Repository,
    },
  ];

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

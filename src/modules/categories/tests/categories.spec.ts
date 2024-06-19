import { productMother } from "@modules/products/tests/products.mother";
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
  let categoryRepositoryMock: Repository<Category>;

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
    categoryRepositoryMock = module.get<Repository<Category>>(
      getRepositoryToken(Category)
    );
  });

  it("should be defined", () => {
    expect(categoriesController).toBeDefined();
  });

  describe("POST", () => {
    it("should create when don't exists", async () => {
      const category = categoryMother.dessert
        .withProducts(productMother)
        .withoutCircularReference();

      jest
        .spyOn(categoryRepositoryMock, "save")
        .mockResolvedValueOnce(category);
      jest.spyOn(categoryRepositoryMock, "findOne").mockResolvedValueOnce(null);

      const response = await categoriesController.create(
        category.asCreateDTO()
      );

      expect(response).toEqual(category);
      expect(response).toBeJSONStringifiable();
    });

    it("should error when exists", async () => {
      const category = categoryMother.dessert;

      jest
        .spyOn(categoryRepositoryMock, "save")
        .mockResolvedValueOnce(category);
      jest
        .spyOn(categoryRepositoryMock, "findOne")
        .mockResolvedValueOnce(category);

      expect(
        async () => await categoriesController.create(category.asCreateDTO())
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("GET", () => {
    it("should return all categories", async () => {
      const categories = [
        categoryMother.dessert
          .withProducts(productMother)
          .withoutCircularReference(),
        categoryMother.hamburger
          .withProducts(productMother)
          .withoutCircularReference(),
      ];

      jest
        .spyOn(categoryRepositoryMock, "find")
        .mockResolvedValueOnce(categories);

      const response = await categoriesController.findAll();

      expect(response).toEqual(categories);
      expect(response).toBeJSONStringifiable();
    });
  });

  describe("GET /:slug", () => {
    it("should return if exists", async () => {
      const category = categoryMother.dessert.withProducts(productMother).withoutCircularReference();
      jest
        .spyOn(categoryRepositoryMock, "findOne")
        .mockResolvedValueOnce(category);

      const response = await categoriesController.findOne(category.slug);

      expect(response).toEqual(category);
      expect(response).toBeJSONStringifiable();
    });

    it("should error if not exists", async () => {
      const category = categoryMother.dessert.withProducts(productMother);
      jest.spyOn(categoryRepositoryMock, "findOne").mockResolvedValueOnce(null);

      expect(
        async () => await categoriesController.findOne(category.slug)
      ).rejects.toThrow("Category not found");
    });
  });

  describe("POST /:id", () => {
    it("should update when OK", async () => {
      const category = categoryMother.dessert.withProducts(productMother);
      const description = "updated description";
      const updatedCategory = category.withDescription(description);

      jest.spyOn(categoryRepositoryMock, "findOne").mockResolvedValue(category);
      jest
        .spyOn(categoryRepositoryMock, "save")
        .mockResolvedValue(updatedCategory);

      const response = await categoriesController.update(category.id, {
        description,
      });

      expect(response).toEqual(updatedCategory.withoutCircularReference());
      expect(response).toBeJSONStringifiable();
    });

    it("should error when dont exists", async () => {
      jest.spyOn(categoryRepositoryMock, "findOne").mockResolvedValue(null);

      expect(
        async () =>
          await categoriesController.update(categoryMother.dessert.id, {
            description: "updated description",
          })
      ).rejects.toThrow("Category not found");
    });

    it("should error when slug already exists", async () => {
      jest
        .spyOn(categoryRepositoryMock, "findOne")
        .mockResolvedValue(categoryMother.hamburger);

      expect(
        async () =>
          await categoriesController.update(categoryMother.dessert.id, {
            slug: categoryMother.hamburger.slug,
          })
      ).rejects.toThrow("Category already exists with this slug");
    });
  });
});

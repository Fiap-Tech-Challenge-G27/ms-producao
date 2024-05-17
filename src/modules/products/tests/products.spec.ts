import { Category } from "@modules/categories/infra/typeorm/entities/category";
import { categoryMother } from "@modules/categories/tests/category.mother";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductsController } from "../controller/products.controller";
import { Product } from "../infra/typeorm/entities/product";
import { basicProductsModuleMetadata } from "../products.module";
import { productMother } from "./products.mother";

describe("/products", () => {
  let productsController: ProductsController;
  let productRepositoryMock: Repository<Product>;
  let categoryRepositoryMock: Repository<Category>;

  let moduleMetadata = { ...basicProductsModuleMetadata };
  moduleMetadata.providers = [
    ...moduleMetadata.providers,
    {
      provide: getRepositoryToken(Product),
      useClass: Repository,
    },
    {
      provide: getRepositoryToken(Category),
      useClass: Repository,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule(moduleMetadata).compile();

    productsController = module.get<ProductsController>(ProductsController);
    productRepositoryMock = module.get<Repository<Product>>(
      getRepositoryToken(Product)
    );
    categoryRepositoryMock = module.get<Repository<Category>>(
      getRepositoryToken(Category)
    );
  });

  it("should be defined", () => {
    expect(productsController).toBeDefined();
  });

  describe("POST", () => {
    it("should create if OK", async () => {
      const product = productMother.cake;

      jest.spyOn(productRepositoryMock, "save").mockResolvedValueOnce(product);
      jest
        .spyOn(categoryRepositoryMock, "findOne")
        .mockResolvedValueOnce(categoryMother.dessert);
      jest
        .spyOn(productRepositoryMock, "findOne")
        .mockResolvedValueOnce(product);

      const response = await productsController.create(product.asCreateDTO());

      expect(response).toEqual(product);
    });
    it("should error if category dont exists", async () => {
      const product = productMother.cake;

      jest.spyOn(productRepositoryMock, "save").mockResolvedValueOnce(product);
      jest.spyOn(categoryRepositoryMock, "findOne").mockResolvedValueOnce(null);

      expect(
        async () => await productsController.create(product.asCreateDTO())
      ).rejects.toThrow("Category not found");
    });
  });

  describe("GET", () => {
    it("should return all products", async () => {
      const products = Object.values(productMother);

      jest.spyOn(productRepositoryMock, "find").mockResolvedValueOnce(products);

      const response = await productsController.findAll();

      expect(response).toEqual(products);
    });
  });

  describe("PATCH :id", () => {
    it("should update when OK", async () => {
      const product = productMother.cake;
      const description = "updated description";
      const updatedProduct = product.withDescription(description);

      jest.spyOn(productRepositoryMock, "findOne").mockResolvedValue(product);
      jest
        .spyOn(categoryRepositoryMock, "findOne")
        .mockResolvedValue(categoryMother.dessert);
      jest
        .spyOn(productRepositoryMock, "save")
        .mockResolvedValue(updatedProduct);

      const response = await productsController.update(product.id, {
        description,
      });

      expect(response).toEqual(updatedProduct);
    });

    it("should error when dont exists", async () => {
      jest.spyOn(productRepositoryMock, "findOne").mockResolvedValue(null);

      expect(
        async () =>
          await productsController.update(productMother.cake.id, {
            description: "updated description",
          })
      ).rejects.toThrow("Product not found");
    });
  });

  describe("DELETE :id", () => {
    it("should soft delete when OK", async () => {
      const product = productMother.cake;
      const softDeletedProduct = product.softDeleted();

      const updatedResult = {
        raw: '',
        generatedMaps: [softDeletedProduct]
      }
      jest.spyOn(productRepositoryMock, "findOne").mockResolvedValue(product);
      jest
        .spyOn(productRepositoryMock, "softDelete")
        .mockResolvedValue(updatedResult);

      const response = await productsController.remove(product.id);

      expect(response).toEqual(updatedResult);
    });
    it("should error when dont exists", async () => {
      jest.spyOn(productRepositoryMock, "findOne").mockResolvedValue(null);

      expect(
        async () => await productsController.remove(productMother.cake.id)
      ).rejects.toThrow("Product not found");
    });
  });
});

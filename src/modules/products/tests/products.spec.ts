import { ProductsController } from "../controller/products.controller";
import { Repository, UpdateResult } from "typeorm";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Product } from "../infra/typeorm/entities/product";
import { basicProductsModuleMetadata } from "../products.module";
import { Category } from "@modules/categories/infra/typeorm/entities/category";
import { productMother } from "./products.mother";
import { categoryMother } from "@modules/categories/tests/category.mother";
import { BadRequestException } from "@nestjs/common";

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
    it("should return all categories", async () => {
        const products = Object.values(productMother)
        
        jest.spyOn(productRepositoryMock, "find").mockResolvedValueOnce(products);
        jest.spyOn(categoryRepositoryMock, "findOne").mockImplementation(({where}) => { return categoryMother[where['id']] });

        const response = await productsController.findAll();

        expect(response).toEqual(products);

      });
  })
});

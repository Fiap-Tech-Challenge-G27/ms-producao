import { Category } from "@modules/categories/infra/typeorm/entities/category";
import { ProductsController } from "@modules/products/controller/products.controller";
import { Product } from "@modules/products/infra/typeorm/entities/product";
import { basicProductsModuleMetadata } from "@modules/products/products.module";
import { productMother } from "@modules/products/tests/products.mother";
import { ProductProxy } from "@modules/products/tests/products.proxy";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { defineFeature, loadFeature } from "jest-cucumber";
import { Repository } from "typeorm";

const feature = loadFeature("behavior_tests/features/listAvailableProducts.feature");

defineFeature(feature, (test) => {
  let productRepositoryMock: Repository<Product>;
  let productsController: ProductsController;

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
  });

  test("See available products", ({ given, when, then }) => {
    let expectedProducts: ProductProxy[] = [];
    let response = undefined;

    beforeEach(async () => {
      expectedProducts = Object.values(productMother);

      jest
        .spyOn(productRepositoryMock, "find")
        .mockResolvedValueOnce(expectedProducts);
    });

    when("I request the list of products", async () => {
      response = await productsController.findAll();
    });

    given("I get the list of products", async () => {
      expect(response).toEqual(expectedProducts);
    });
  });
});

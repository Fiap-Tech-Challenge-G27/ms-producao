import { ProductsController } from "../controller/products.controller";
import { Repository, UpdateResult } from "typeorm";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Product } from "../infra/typeorm/entities/product";
import { basicProductsModuleMetadata } from "../products.module";
import { Category } from "@modules/categories/infra/typeorm/entities/category";

describe("/products", () => {
  let productsController: ProductsController;
  let repositoryMock: Repository<Product>;

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
    repositoryMock = module.get<Repository<Product>>(
      getRepositoryToken(Product)
    );
  });

  describe("POST", () => {
    it("should create when don't exists", async () => {
      console.log("teste");
    });
  });
});

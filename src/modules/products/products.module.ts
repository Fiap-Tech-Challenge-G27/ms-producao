import { ICategoryRepository } from "@categories/core/category-repository.abstract";
import { Category } from "@categories/infra/typeorm/entities/category";
import { CategoryRepository } from "@categories/infra/typeorm/repositories/category.repository";
import { Module, Provider } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "@products/infra/typeorm/entities/product";
import { ProductImage } from "@products/infra/typeorm/entities/productImage";
import { ProductRepository } from "@products/infra/typeorm/repositories/product.repository";
import { ExceptionsService } from "@shared/infra/exceptions/exceptions.service";
import { IExceptionService } from "../../shared/exceptions/exceptions.interface";
import { CategoryMapper } from "../categories/core/category.mapper";
import { ProductsController } from "./controller/products.controller";
import { IProductRepository } from "./core/product-repository.abstract";
import { ProductMapper } from "./core/product.mapper";
import {
    CreateProductUseCase,
    FindAllProductsUseCase,
    RemoveProductUseCase,
    UpdateProductUseCase,
} from "./use-cases";

const basicProductsModuleMetadata = {
  controllers: [ProductsController],
  providers: [
    {
      provide: ICategoryRepository,
      useClass: CategoryRepository,
    },
    {
      provide: IProductRepository,
      useClass: ProductRepository,
    },
    {
      provide: IExceptionService,
      useClass: ExceptionsService,
    },
    CategoryMapper,
    ProductMapper,
    CreateProductUseCase,
    FindAllProductsUseCase,
    RemoveProductUseCase,
    UpdateProductUseCase,
  ] as Array<Provider>,
}

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductImage, Category])],
  ...basicProductsModuleMetadata
})
class ProductsModule {}

export { ProductsModule, basicProductsModuleMetadata };


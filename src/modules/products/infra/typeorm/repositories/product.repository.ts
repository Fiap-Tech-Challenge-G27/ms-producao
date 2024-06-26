import { CategoryEntity } from "@categories/core/category.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { IProductRepository } from "@products/core/product-repository.abstract";
import { ProductEntity } from "@products/core/product.entity";
import { Repository } from "typeorm";
import { Product } from "../entities/product";

export class ProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ) {}

  async create(product: ProductEntity): Promise<ProductEntity> {
    const productModel = this.mapEntityToModel(product);

    const productCreated = await this.productRepository.save(productModel);

    const getProduct = await this.productRepository.findOne({
      where: { id: productCreated.id },
      relations: ["category"],
      loadEagerRelations: false,
    });

    return this.mapModelToEntity(getProduct);
  }

  async findAll(): Promise<ProductEntity[]> {
    const listOfProducts = await this.productRepository.find({
      relations: ["category"],
      loadEagerRelations: false,
    });

    return listOfProducts.map((product) => this.mapModelToEntity(product));
  }

  async findOne(id: string): Promise<ProductEntity> {
    try {
      const productModel = await this.productRepository.findOne({
        where: { id },
        relations: ["category"],
        loadEagerRelations: false,
      });

      return this.mapModelToEntity(productModel);
    } catch (error) {
      return null;
    }
  }

  async remove(id: string) {
    return await this.productRepository.softDelete(id);
  }

  async update(id: string, product: ProductEntity): Promise<ProductEntity> {
    const productModel = await this.productRepository.findOne({
      where: { id },
    });

    productModel.name = product.name;
    productModel.description = product.description;
    productModel.category = <any>product.category;
    productModel.price = product.price;
    productModel.quantity = product.quantity;
    productModel.status = product.status;

    const productUpdated = await this.productRepository.save(productModel);

    return this.mapModelToEntity(productUpdated);
  }

  mapModelToEntity(dataModel: Product): ProductEntity {
    if (!dataModel) {
      return null;
    }

    let category: CategoryEntity = undefined;
    if (dataModel.category) {
      category = new CategoryEntity(
        dataModel.category.name,
        dataModel.category.slug,
        dataModel.category.description,
        dataModel.category.id,
        dataModel.category.createdAt,
        dataModel.category.updatedAt,
        []
      );
    }

    const product = new ProductEntity(
      dataModel.name,
      dataModel.description,
      dataModel.price,
      dataModel.quantity,
      dataModel.status,
      category
    );
    product.id = dataModel.id;
    product.createdAt = dataModel.createdAt;
    product.updatedAt = dataModel.updatedAt;
    return product;
  }
  mapEntityToModel(dataEntity: ProductEntity): Product {
    /* istanbul ignore next */
    if (!dataEntity) {
      /* istanbul ignore next */
      return null;
    }

    const product = new Product();
    product.name = dataEntity.name;
    product.description = dataEntity.description;
    product.category = <any>dataEntity.category;
    product.price = dataEntity.price;
    product.quantity = dataEntity.quantity;
    product.status = dataEntity.status;

    return product;
  }
}

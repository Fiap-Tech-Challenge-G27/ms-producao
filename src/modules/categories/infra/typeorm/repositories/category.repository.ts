import { ICategoryRepository } from "@categories/core/category-repository.abstract";
import { CategoryEntity } from "@modules/categories/core/category.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductEntity } from "@products/core/product.entity";
import { Repository } from "typeorm";
import { Category } from "../entities/category";

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) {}

  async create(category: CategoryEntity): Promise<CategoryEntity> {
    const categoryModel = this.mapEntityToModel(category);

    const categoryCreated = await this.categoryRepository.save(categoryModel);

    return this.mapModelToEntity(categoryCreated);
  }

  async findAll() {
    const categories = await this.categoryRepository.find();

    return categories.map((category) => this.mapModelToEntity(category));
  }

  async findOne(idOrSlug: string, type: "id" | "slug") {
    const queryByType = {
      id: { where: { id: idOrSlug } },
      slug: { where: { slug: idOrSlug } },
    };

    try {
      const result = await this.categoryRepository.findOne(queryByType[type]);

      return this.mapModelToEntity(result);
    } catch (error) {
      /* istanbul ignore next */
      throw new Error("An error occurred while fetching the category");
    }
  }

  async update(id: string, category: CategoryEntity): Promise<CategoryEntity> {
    const categoryModel = await this.categoryRepository.findOne({
      where: { id },
    });

    categoryModel.name = category.name || categoryModel.name;
    categoryModel.slug = category.slug || categoryModel.slug;
    /* istanbul ignore next */
    categoryModel.description =
      category.description || categoryModel.description;

    await this.categoryRepository.save(categoryModel);

    return this.mapModelToEntity(categoryModel);
  }

  mapModelToEntity(dataModel: Category): CategoryEntity {
    if (!dataModel) {
      return null;
    }
    let productsEntity: ProductEntity[];
    if (dataModel.products) {
      productsEntity = dataModel.products.map((product) => {
        const newProduct = new ProductEntity(
          product.name,
          product.description,
          product.price,
          product.quantity,
          product.status,
          undefined,
          product.id,
          product.createdAt,
          product.updatedAt,
          product.deletedAt
        );

        return newProduct;
      });
    }

    const category = new CategoryEntity(
      dataModel.name,
      dataModel.slug,
      dataModel.description,
      dataModel.id,
      dataModel.createdAt,
      dataModel.updatedAt,
      productsEntity
    );

    for (const productEntity of productsEntity) {
      productEntity.category = category;
    }

    return category;
  }

  mapEntityToModel(dataEntity: CategoryEntity): Category {
    const category = new Category(
      dataEntity.name,
      dataEntity.slug,
      dataEntity.description
    );

    return category;
  }
}

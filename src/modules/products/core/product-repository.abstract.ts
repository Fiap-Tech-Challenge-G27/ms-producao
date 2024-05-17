import { Repository } from "@shared/core/repository";
import { ProductEntity } from "./product.entity";

export abstract class IProductRepository extends Repository<ProductEntity> {}

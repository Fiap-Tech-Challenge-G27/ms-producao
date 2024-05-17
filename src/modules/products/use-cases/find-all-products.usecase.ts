import { Injectable } from "@nestjs/common";
import { UseCase } from "@shared/core/use-case";
import { IProductRepository } from "../core/product-repository.abstract";

@Injectable()
export class FindAllProductsUseCase implements UseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute() {
    const listOfProducts = await this.productRepository.findAll();

    return listOfProducts;
  }
}

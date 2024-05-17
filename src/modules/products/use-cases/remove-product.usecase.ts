import { Inject, Injectable } from "@nestjs/common";
import { UseCase } from "@shared/core/use-case";
import { IExceptionService } from "@shared/exceptions/exceptions.interface";
import { IProductRepository } from "../core/product-repository.abstract";

@Injectable()
export class RemoveProductUseCase implements UseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    @Inject(IExceptionService)
    private readonly exceptionService: IExceptionService,
  ) {}

  async execute(id: string) {
    const product = await this.productRepository.findOne(id);

    if (!product) {
      this.exceptionService.notFoundException({
        message: "Product not found",
        code: 404,
      });
    }

    return await this.productRepository.remove(id);
  }
}

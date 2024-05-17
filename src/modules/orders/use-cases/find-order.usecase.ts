import { Inject, Injectable } from "@nestjs/common";
import { UseCase } from "@shared/core/use-case";
import { IExceptionService } from "@shared/exceptions/exceptions.interface";
import { IOrderRepository } from "../core/order-repository.abstract";

@Injectable()
export class FindOrderUseCase implements UseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    @Inject(IExceptionService)
    private readonly exceptionService: IExceptionService,
  ) {}

  async execute(id: string) {
    const order = await this.orderRepository.findOne(id);

    if (!order) {
      this.exceptionService.notFoundException({
        message: "Order not found",
        code: 404,
      });
    }

    return order;
  }
}

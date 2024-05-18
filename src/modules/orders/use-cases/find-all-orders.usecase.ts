import { Inject, Injectable } from "@nestjs/common";
import { UseCase } from "@shared/core/use-case";
import { IOrderRepository } from "../core/order-repository.abstract";
import { OrderEntity } from "../core/order.entity";

@Injectable()
export class FindAllOrdersUseCase implements UseCase {
  constructor(
    @Inject(IOrderRepository)
    private readonly orderRepository: IOrderRepository,
  ) {}

  private readonly statePriority: Record<string, number> = {
    Done: 0,
    InPreparation: 1,
    Received: 2,
  };

  async execute(customerId: string) {
    const orders = await this.orderRepository.findAllByCustomerId(customerId);

    const filteredOrders = orders.filter(
      (order: OrderEntity) => order.state !== "Finished",
    );

    const sortedOrders = filteredOrders.sort((a, b) => {
      const stateOrder =
      this.statePriority[a.state] - this.statePriority[b.state];
      if (stateOrder !== 0) {
        return stateOrder;
      }
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

    return sortedOrders;
  }
}

import { AuthGuard } from "@modules/auth/auth.guard";
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
  Headers
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CreateOrderDto } from "@orders/dtos/create-order.dto";
import { PaymentConfirmationDto } from "../dtos/payment-confirmation.dto";
import { UpdateOrderDto } from "../dtos/update-order.dto";
import { ConfirmatePaymentUseCase } from "../use-cases/confimate-payment.usecase";
import { FindOrderUseCase } from "../use-cases/find-order.usecase";
import { UpdateOrderUseCase } from "../use-cases/update-order.usecase";
import { CreateOrderUseCase } from "./../use-cases/create-order.usecase";
import { FindAllOrdersUseCase } from "./../use-cases/find-all-orders.usecase";
import axios from 'axios';

@ApiTags("orders")
@Controller("orders")
export class OrdersController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly findAllOrdersUseCase: FindAllOrdersUseCase,
    private readonly findOrderUseCase: FindOrderUseCase,
    private readonly confirmatePaymentUseCase: ConfirmatePaymentUseCase,
    private readonly updateOrderUseCase: UpdateOrderUseCase, //private readonly updateOrderPaymentStateUseCase: UpdateOrderPaymentStateUseCase,
  ) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async create(@Body() createOrdersDto: CreateOrderDto, @Request() req) {
    return await this.createOrderUseCase.execute(
      createOrdersDto,
      req.customer.data._id,
    );
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  findAll(@Request() req) {
    return this.findAllOrdersUseCase.execute(req.customer.data._id);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.findOrderUseCase.execute(id);
  }

  @Patch("/:id/state")
  updateOrderStatus(
    @Param("id") orderId: string,
    @Body() statusDto: UpdateOrderDto,
  ) {
    return this.updateOrderUseCase.execute(orderId, statusDto);
  }

  @Post("/payment-confirmation")
  async confirmPayment(@Body() payment_confirmation: PaymentConfirmationDto): Promise<void> {

    console.log(payment_confirmation);
    // const orderId = payment_confirmation["identifier"]["orderId"];
    // const status = payment_confirmation["status"];
    
    return this.confirmatePaymentUseCase.execute(payment_confirmation);

  }

  

  // receivePaymentConfirmation(
  //   @Body() payment_confirmation: PaymentConfirmationDto,
  // ): Promise<void> {
  //   const orderId = payment_confirmation["identifier"]["orderId"];
  //   const status = payment_confirmation["status"];

  //   return this.confirmatePaymentUseCase.execute(orderId, status);
  // }
}

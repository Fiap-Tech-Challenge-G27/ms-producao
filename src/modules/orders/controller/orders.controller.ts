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
  async handleSnsMessage(@Headers() headers, @Body() body: string): Promise<any> {
    const messageType = headers['x-amz-sns-message-type'];
    console.log(JSON.parse(body));
    console.log(messageType);

    if (messageType === 'SubscriptionConfirmation') {
      console.log('SNS Notification:', JSON.parse(body));

      const topicArn = JSON.parse(body)["topicArn"];
      const token = JSON.parse(body)["token"];

      const url = `https://sns.us-east-1.amazonaws.com/?Action=ConfirmSubscription&TopicArn=${topicArn}&Token=${token}`;
      await axios.get(url);

      // Handle subscription confirmation (verify the token with AWS and subscribe the endpoint)
    } else if (messageType === 'Notification') {

      console.log('SNS Notification:', JSON.parse(body));

      const orderId = JSON.parse(body)["identifier"]["orderId"];
      const status = JSON.parse(body)["status"];

      return this.confirmatePaymentUseCase.execute(orderId, status);

    }

  }

  

  // receivePaymentConfirmation(
  //   @Body() payment_confirmation: PaymentConfirmationDto,
  // ): Promise<void> {
  //   const orderId = payment_confirmation["identifier"]["orderId"];
  //   const status = payment_confirmation["status"];

  //   return this.confirmatePaymentUseCase.execute(orderId, status);
  // }
}

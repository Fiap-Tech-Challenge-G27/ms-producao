import { IPaymentGateway } from "@modules/orders/core/payment-gateway";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

@Injectable()
export class PaymentGateway implements IPaymentGateway {
  constructor(private configService: ConfigService) {}

  async create(orderId: string) {
    try {
      const snsClient = new SNSClient({});

      const data = {
        identifier: {
          orderId: orderId,
        },
      };

      const messageResponse = await snsClient.send(
        new PublishCommand({
          Message: JSON.stringify(data),
          TopicArn: this.configService.get<string>("AWS_SNS_TOPIC_ARN"),
        })
      );

      console.info("Message: ", messageResponse);
    } catch (error) {
      console.error(error);
      throw new Error("Error on submit to payment-gateway");
    }
  }
}

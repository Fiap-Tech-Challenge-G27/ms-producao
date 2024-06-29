import { IPaymentGateway } from "@modules/orders/core/payment-gateway";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import AWS from "aws-sdk";

@Injectable()
export class PaymentGateway implements IPaymentGateway {
  constructor(private configService: ConfigService) {}

  async create(orderId: string) {
    AWS.config.update({
      region: this.configService.get<string>("AWS_REGION"),
    });

    try {
      const sns = new AWS.SNS({
        apiVersion: this.configService.get<string>("AWS_SNS_API_VERSION"),
      });

      const data = {
        identifier: {
          orderId: orderId,
        },
      };

      const messageResponse = await sns
        .publish({
          Message: JSON.stringify(data),
          TopicArn: this.configService.get<string>("AWS_SNS_TOPIC_ARN"),
        })
        .promise();

      console.info("MessageId: ", messageResponse.MessageId);
    } catch (error) {
      console.error(error);
      throw new Error("Error on submit to payment-gateway");
    }
  }
}

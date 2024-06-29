import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { PaymentGateway } from "./payment-gateway";

jest.mock("@aws-sdk/client-sns");

describe("PaymentGateway", () => {
  let paymentGateway: PaymentGateway;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentGateway,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue("mock-topic-arn"),
          },
        },
      ],
    }).compile();

    paymentGateway = module.get<PaymentGateway>(PaymentGateway);
    configService = module.get<ConfigService>(ConfigService);
  });

  it("should be defined", () => {
    expect(paymentGateway).toBeDefined();
  });

  it("should publish message to SNS", async () => {
    const orderId = "12345";
    const mockResponse = { MessageId: "mock-message-id" };

    const snsClient = SNSClient.prototype;
    snsClient.send = jest.fn().mockResolvedValue(mockResponse);

    await paymentGateway.create(orderId);

    expect(snsClient.send).toHaveBeenCalledWith(expect.any(PublishCommand));
    expect(snsClient.send).toHaveBeenCalledTimes(1);
  });
});

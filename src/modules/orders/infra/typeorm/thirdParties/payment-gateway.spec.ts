import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { randomId } from "@shared/tests/random";
import { PaymentGateway } from "./payment-gateway";

describe("payment-gateway", () => {
  const payment_url = "mock_payment_url";
  let paymentGateway: PaymentGateway;
  const fetchMock = jest.spyOn(global, "fetch").mockResolvedValue(null);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentGateway,
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue(payment_url) },
        },
      ],
    }).compile();

    paymentGateway = module.get<PaymentGateway>(PaymentGateway);
  });

  it("should request made", () => {
    const orderId = randomId();

    paymentGateway.create(orderId)
    
    const calls = fetchMock.mock.calls

    expect(calls.length).toBe(1)

    const [actual_payment_url, request] = calls[0]

    expect(actual_payment_url).toBe(payment_url)

    expect(request['method']).toBe("POST")
    
    expect(request['body']).toBe(JSON.stringify({"identifier": {orderId}}))
  })
});

import { Category } from "@modules/categories/infra/typeorm/entities/category";
import { Product } from "@modules/products/infra/typeorm/entities/product";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OrdersController } from "../controller/orders.controller";
import { OrderState, PaymentState } from "../core/order.entity";
import { IPaymentGateway } from "../core/payment-gateway";
import { Order } from "../infra/typeorm/entities/order";
import { OrdersProductsAmounts } from "../infra/typeorm/entities/orders-products-amounts";
import { basicProductModuleMetadata } from "../orders.module";
import { customerMother } from "./customerId.mother";
import { orderMother } from "./order.mother";

describe("/orders", () => {
  let ordersController: OrdersController;
  let orderRepositoryMock: Repository<Order>;
  let orderProductsAmountsRepositoryMock: Repository<OrdersProductsAmounts>;
  let productRepositoryMock: Repository<Product>;

  let req;

  let moduleMetadata = { ...basicProductModuleMetadata };
  moduleMetadata.providers = [
    ...moduleMetadata.providers,
    {
      provide: getRepositoryToken(Category),
      useClass: Repository,
    },
    {
      provide: getRepositoryToken(Product),
      useClass: Repository,
    },
    {
      provide: getRepositoryToken(Order),
      useClass: Repository,
    },
    {
      provide: getRepositoryToken(OrdersProductsAmounts),
      useClass: Repository,
    },
    {
      provide: ConfigService,
      useValue: { get: jest.fn().mockResolvedValue("mock") },
    },
    {
      provide: JwtService,
      useValue: {
        verifyAsync: jest
          .fn()
          .mockResolvedValue({ data: customerMother.customer }),
      },
    },
    {
      provide: IPaymentGateway,
      useValue: {
        create: jest.fn(),
      },
    },
  ];

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule(moduleMetadata).compile();

    ordersController = module.get<OrdersController>(OrdersController);
    orderRepositoryMock = module.get<Repository<Order>>(
      getRepositoryToken(Order)
    );
    orderProductsAmountsRepositoryMock = module.get<
      Repository<OrdersProductsAmounts>
    >(getRepositoryToken(OrdersProductsAmounts));
    productRepositoryMock = module.get<Repository<Product>>(
      getRepositoryToken(Product)
    );

    req = {
      customer: { data: customerMother.customer },
    };
  });

  function testPaymentReceivement(
    confirmationStatus: string,
    expectedState: OrderState,
    expectedPaymentState: PaymentState
  ) {
    return async () => {
      const order = orderMother.sugar_overdose;
      jest.spyOn(orderRepositoryMock, "findOne").mockResolvedValueOnce(order);
      const saveMock = jest
        .spyOn(orderRepositoryMock, "save")
        .mockResolvedValueOnce(order);
      await ordersController.receivePaymentConfirmation({
        identifier: { order_id: order.id },
        status: confirmationStatus,
      });
      const call = saveMock.mock.calls[0][0];
      expect(Object.keys(call)).toContain("state");
      expect(call["state"]).toBe(expectedState);
      expect(Object.keys(call)).toContain("paymentState");
      expect(call["paymentState"]).toBe(expectedPaymentState);
    };
  }

  it("should be defined", () => {
    expect(ordersController).toBeDefined();
  });

  describe("POST", () => {
    it("should create when ok", async () => {
      const order = orderMother.sugar_overdose;
      const createdOrder = order.withRandomId();

      jest
        .spyOn(orderRepositoryMock, "save")
        .mockResolvedValueOnce(createdOrder.withoutOrderProductsAmounts());
      jest
        .spyOn(productRepositoryMock, "findOne")
        .mockImplementation(async (options) => {
          return { id: options } as any;
        });

      for (let orderProduct of createdOrder.orderProductsAmounts) {
        jest
          .spyOn(orderProductsAmountsRepositoryMock, "save")
          .mockResolvedValueOnce(orderProduct);
      }

      const response = await ordersController.create(order.asCreateDTO(), req);

      expect(response).toEqual(createdOrder.withOrderProductsAsUnderfined());
    });

    it("should error when empty", async () => {
      expect(
        async () =>
          await ordersController.create(
            orderMother.sugar_overdose
              .withoutOrderProductsAmounts()
              .asCreateDTO(),
            req
          )
      ).rejects.toThrow("Order products is empty");
    });
  });

  describe("GET", () => {
    it("should return all orders", async () => {
      const orders = Object.values(orderMother);

      jest.spyOn(orderRepositoryMock, "find").mockResolvedValueOnce(orders);

      const response = await ordersController.findAll(req);

      expect(response).toEqual([
        orderMother.lunch.withIdUnderfined().withOrderProductsAsUnderfined(),
        orderMother.dinner.withIdUnderfined().withOrderProductsAsUnderfined(),
        orderMother.sugar_overdose.withIdUnderfined().withOrderProductsAsUnderfined(),
      ]);
    });
  });

  describe("GET /:id", () => {
    it("should return when exists", async () => {
      const order = orderMother.sugar_overdose;

      jest.spyOn(orderRepositoryMock, "findOne").mockResolvedValueOnce(order);

      const response = await ordersController.findOne(order.id);

      expect(response).toEqual(order.withOrderProductsAsUnderfined());
    });
    it("should error when don't exists", async () => {
      jest.spyOn(orderRepositoryMock, "findOne").mockResolvedValueOnce(null);

      expect(
        async () =>
          await ordersController.findOne(orderMother.sugar_overdose.id)
      ).rejects.toThrow("Order not found");
    });
  });

  describe("PATCH /:id/state", () => {
    it("should update when ok", async () => {
      const order = orderMother.sugar_overdose;
      const state = OrderState.InPreparation;
      const paymentState = PaymentState.Approved;
      const updatedOrder = order
        .withState(state)
        .withPaymentState(paymentState);

      jest.spyOn(orderRepositoryMock, "findOne").mockResolvedValueOnce(order);
      jest
        .spyOn(orderRepositoryMock, "save")
        .mockResolvedValueOnce(updatedOrder);

      const response = await ordersController.updateOrderStatus(order.id, {
        state,
        paymentState,
      });

      expect(response).toEqual(updatedOrder);
    });

    it("should error when dont exists", async () => {
      jest.spyOn(orderRepositoryMock, "findOne").mockResolvedValueOnce(null);

      expect(
        async () =>
          await ordersController.updateOrderStatus(
            orderMother.sugar_overdose.id,
            {
              state: OrderState.InPreparation,
            }
          )
      ).rejects.toThrow("Order not found");
    });
  });

  describe("POST /webhooks/payment-confirmation", () => {
    it(
      "should update to InPreparation when approved",
      testPaymentReceivement(
        "approved",
        OrderState.InPreparation,
        PaymentState.Approved
      )
    );

    it(
      "should update to Finish when canceled",
      testPaymentReceivement(
        "canceled",
        OrderState.Finished,
        PaymentState.Canceled
      )
    );

    it("should error when dont exists", async () => {
      jest.spyOn(orderRepositoryMock, "findOne").mockResolvedValueOnce(null);

      expect(
        async () =>
          await ordersController.receivePaymentConfirmation({
            identifier: { order_id: orderMother.sugar_overdose.id },
            status: "canceled",
          })
      ).rejects.toThrow("Order not found");
    });
  });
});

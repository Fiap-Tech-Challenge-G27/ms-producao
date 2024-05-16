import { Product } from "@modules/products/infra/typeorm/entities/product";
import { OrdersController } from "../controller/orders.controller";
import { Repository, UpdateResult } from "typeorm";
import { Category } from "@modules/categories/infra/typeorm/entities/category";
import { basicProductModuleMetadata } from "../orders.module";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Order } from "../infra/typeorm/entities/order";
import { Test, TestingModule } from "@nestjs/testing";
import { OrdersProductsAmounts } from "../infra/typeorm/entities/orders-products-amounts";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { customerMother } from "./customerId.mother";
import { orderMother } from "./order.mother";
import { IPaymentGateway } from "../core/payment-gateway";
import { OrderState, PaymentState } from "../core/order.entity";

describe("/orders", () => {
  let ordersController: OrdersController;
  let productRepositoryMock: Repository<Product>;
  let categoryRepositoryMock: Repository<Category>;
  let orderRepositoryMock: Repository<Order>;
  let orderProductsAmountsRepositoryMock: Repository<OrdersProductsAmounts>;

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
    categoryRepositoryMock = module.get<Repository<Category>>(
      getRepositoryToken(Category)
    );
    productRepositoryMock = module.get<Repository<Product>>(
      getRepositoryToken(Product)
    );
    orderRepositoryMock = module.get<Repository<Order>>(
      getRepositoryToken(Order)
    );
    orderProductsAmountsRepositoryMock = module.get<
      Repository<OrdersProductsAmounts>
    >(getRepositoryToken(OrdersProductsAmounts));

    req = {
      customer: { data: customerMother.customer },
    };
  });

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

      for (let orderProduct of createdOrder.orderProductsAmounts) {
        jest
          .spyOn(orderProductsAmountsRepositoryMock, "save")
          .mockResolvedValueOnce(orderProduct);
      }

      const response = await ordersController.create(order.asCreateDTO(), req);

      expect(response).toEqual(createdOrder);
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
        orderMother.dinner,
        orderMother.sugar_overdose,
      ]);
    });
  });

  describe("GET /:id", () => {
    it("should return when exists", async () => {
      const order = orderMother.sugar_overdose;

      jest.spyOn(orderRepositoryMock, "findOne").mockResolvedValueOnce(order);

      const response = await ordersController.findOne(order.id);

      expect(response).toEqual(order);
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
      const updatedOrder = order.withState(state);

      jest.spyOn(orderRepositoryMock, "findOne").mockResolvedValueOnce(order);
      jest
        .spyOn(orderRepositoryMock, "save")
        .mockResolvedValueOnce(updatedOrder);

      const response = await ordersController.updateOrderStatus(order.id, {
        state,
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
    it("should update to InPreparation when approved", async () => {
      const order = orderMother.sugar_overdose;

      jest.spyOn(orderRepositoryMock, "findOne").mockResolvedValueOnce(order);
      const saveMock = jest
        .spyOn(orderRepositoryMock, "save")
        .mockResolvedValueOnce(order);

      const response = await ordersController.receivePaymentConfirmation({
        identifier: { order_id: order.id },
        status: "approved",
      });

      const call = saveMock.mock.calls[0][0];

      expect(Object.keys(call)).toContain("state");
      expect(call["state"]).toBe(OrderState.InPreparation);

      expect(Object.keys(call)).toContain("paymentState");
      expect(call["paymentState"]).toBe(PaymentState.Approved);
    });

    it("should update to Finish when canceled", async () => {
      const order = orderMother.sugar_overdose;

      jest.spyOn(orderRepositoryMock, "findOne").mockResolvedValueOnce(order);
      const saveMock = jest
        .spyOn(orderRepositoryMock, "save")
        .mockResolvedValueOnce(order);

      await ordersController.receivePaymentConfirmation({
        identifier: { order_id: order.id },
        status: "canceled",
      });

      const call = saveMock.mock.calls[0][0];

      expect(Object.keys(call)).toContain("state");
      expect(call["state"]).toBe(OrderState.Finished);

      expect(Object.keys(call)).toContain("paymentState");
      expect(call["paymentState"]).toBe(PaymentState.Canceled);
    });

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
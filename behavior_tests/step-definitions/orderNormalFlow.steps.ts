import { Category } from "@modules/categories/infra/typeorm/entities/category";
import { OrdersController } from "@modules/orders/controller/orders.controller";
import { OrderState, PaymentState } from "@modules/orders/core/order.entity";
import { IPaymentGateway } from "@modules/orders/core/payment-gateway";
import { Order } from "@modules/orders/infra/typeorm/entities/order";
import { OrdersProductsAmounts } from "@modules/orders/infra/typeorm/entities/orders-products-amounts";
import { basicProductModuleMetadata } from "@modules/orders/orders.module";
import { customerMother } from "@modules/orders/tests/customerId.mother";
import { orderMother } from "@modules/orders/tests/order.mother";
import { Product } from "@modules/products/infra/typeorm/entities/product";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { defineFeature, loadFeature } from "jest-cucumber";
import { Repository } from "typeorm";
const feature = loadFeature("behavior_tests/features/orderNormalFlow.feature");

const orderStatusMap = {
  received: OrderState.Received,
  "in preparation": OrderState.InPreparation,
  done: OrderState.Done,
  finished: OrderState.Finished,
};
const GivenMyOrderIs = (given, setOrderCallback) => {
  given(/My order (?:is|was) (.*)/, (readableStatus) => {
    setOrderCallback(
      orderMother.sugar_overdose.withState(orderStatusMap[readableStatus])
    );
  });
};

const ThenMyOrderIs = (then, saveCallCallback) => {
  then(/My order (?:is|was) (.*)/, (readableStatus) => {
    expect(saveCallCallback()["state"]).toBe(orderStatusMap[readableStatus]);
  });
};

defineFeature(feature, (test) => {
  let ordersController: OrdersController;
  let orderRepositoryMock: Repository<Order>;
  let orderProductsAmountsRepositoryMock: Repository<OrdersProductsAmounts>;

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
  });

  test("Pay", ({ given, when, then }) => {
    let order = undefined;
    let saveCall = undefined;

    GivenMyOrderIs(given, (newOrder) => {
      order = newOrder;
    });

    when("I pay my order", async () => {
      jest.spyOn(orderRepositoryMock, "findOne").mockResolvedValueOnce(order);
      const saveMock = jest
        .spyOn(orderRepositoryMock, "save")
        .mockResolvedValueOnce(order);

      await ordersController.receivePaymentConfirmation({
        identifier: { order_id: order.id },
        status: "approved",
      });

      saveCall = saveMock.mock.calls[0][0];
    });

    ThenMyOrderIs(then, () => saveCall);

    then("My order's payment state is approved", () => {
      expect(saveCall["paymentState"]).toBe(PaymentState.Approved);
    });
  });

  test("Preparate", ({ given, when, then }) => {
    let order = undefined;
    let saveCall = undefined;

    GivenMyOrderIs(given, (newOrder) => {
      order = newOrder;
    });

    when("I wait the my order preparation", async () => {
      jest.spyOn(orderRepositoryMock, "findOne").mockResolvedValueOnce(order);
      const saveMock = jest
        .spyOn(orderRepositoryMock, "save")
        .mockResolvedValueOnce(order);

      await ordersController.updateOrderStatus(order.id, {
        state: OrderState.Done,
      });

      saveCall = saveMock.mock.calls[0][0];
    });

    ThenMyOrderIs(then, () => saveCall);
  });

  test("Finish", ({ given, when, then }) => {
    let order = undefined;
    let saveCall = undefined;

    GivenMyOrderIs(given, (newOrder) => {
      order = newOrder;
    });

    when("I get my order", async () => {
      jest.spyOn(orderRepositoryMock, "findOne").mockResolvedValueOnce(order);
      const saveMock = jest
        .spyOn(orderRepositoryMock, "save")
        .mockResolvedValueOnce(order);

      await ordersController.updateOrderStatus(order.id, {
        state: OrderState.Finished,
      });

      saveCall = saveMock.mock.calls[0][0];
    });

    ThenMyOrderIs(then, () => saveCall);
  });
});

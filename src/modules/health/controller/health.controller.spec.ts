import { HealthController } from "./health.controller";
import { Test, TestingModule } from "@nestjs/testing";

describe("HealthController", () => {
  let healthController: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    healthController = module.get<HealthController>(HealthController);
  });

  describe("GET /health", () => {
    it("Should be defined", async () => {
      expect(healthController).toBeDefined();
    });

    it("should return 200", async () => {
      expect(healthController.healthCheck()).toBe("");
    });
  });
});

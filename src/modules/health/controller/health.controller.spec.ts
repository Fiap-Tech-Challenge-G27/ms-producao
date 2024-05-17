import { Test, TestingModule } from "@nestjs/testing";
import { HealthModule } from "../health.module";
import { HealthController } from "./health.controller";

describe("HealthController", () => {
  let healthController: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HealthModule],
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

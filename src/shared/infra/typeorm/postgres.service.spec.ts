import { Test, TestingModule } from "@nestjs/testing";
import { PostgresConfigServiceService } from "./postgres.service";
import { ConfigService } from "@nestjs/config";

describe("PostgresConfigServiceService", () => {
  let service: PostgresConfigServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostgresConfigServiceService, {provide: ConfigService, useValue: {}}],
    }).compile();

    service = module.get<PostgresConfigServiceService>(
      PostgresConfigServiceService
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});

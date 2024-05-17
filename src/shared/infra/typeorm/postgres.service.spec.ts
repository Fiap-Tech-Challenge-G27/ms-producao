import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { PostgresConfigServiceService } from "./postgres.service";

describe("PostgresConfigServiceService", () => {
  let databaseUrl = "mock";
  let service: PostgresConfigServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostgresConfigServiceService,
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue(databaseUrl) },
        },
      ],
    }).compile();

    service = module.get<PostgresConfigServiceService>(
      PostgresConfigServiceService
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return config ", () => {
    const result = service.createTypeOrmOptions();

    expect(result["type"]).toBe("postgres");
    expect(result["url"]).toBe(databaseUrl);
    expect(result["synchronize"]).toBe(true);
    expect(result["ssl"]).toBe(false);
  });
});

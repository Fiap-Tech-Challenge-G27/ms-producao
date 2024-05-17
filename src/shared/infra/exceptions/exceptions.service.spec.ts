import {
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException
} from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { ExceptionsService } from "./exceptions.service";

describe("ExceptionsService", () => {
  let service: ExceptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExceptionsService],
    }).compile();

    service = module.get<ExceptionsService>(ExceptionsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should throw forbiddenException", async () => {
    expect(() =>
      service.forbiddenException({ message: "forbidden", code: 401 })
    ).toThrow(ForbiddenException);
  });

  it("should throw notFoundException", async () => {
    expect(() =>
      service.notFoundException({ message: "notFound", code: 404 })
    ).toThrow(NotFoundException);
  });

  it("should throw internalServerErrorException", async () => {
    expect(() =>
      service.internalServerErrorException({ message: "internalServerError", code: 500 })
    ).toThrow(InternalServerErrorException);
  });

  it("should throw badRequestException", async () => {
    expect(() =>
      service.badRequestException({ message: "badRequestException", code: 400 })
    ).toThrow(BadRequestException);
  });
});

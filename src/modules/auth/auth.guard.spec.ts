import { customerMother } from "@modules/orders/tests/customerId.mother";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { AuthGuard } from "./auth.guard";
import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { randomId } from "@shared/tests/random";

function getResponseMock(authorization: string) {
  return {
    originalUrl: "/",
    method: "GET",
    params: undefined,
    query: undefined,
    body: undefined,
    headers: {
      authorization,
    },
  };
}

function getExecutionContextMock(request: object) {
  const context: ExecutionContext = jest.genMockFromModule("@nestjs/common");
  context.switchToHttp = jest.fn().mockReturnValue({
    getRequest: () => request,
  });

  return context;
}

describe("Auth Guard", () => {
  let authGuardMock: AuthGuard;
  let jwtServiceMock: JwtService;
  let payload = { id: randomId() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        JwtService,
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockResolvedValue("mock") },
        },
      ],
    }).compile();

    authGuardMock = module.get<AuthGuard>(AuthGuard);
    jwtServiceMock = module.get<JwtService>(JwtService);
  });

  function testFailToken(token) {
    return async () => {
      jest.spyOn(jwtServiceMock, "verifyAsync").mockRejectedValueOnce(payload);

      const request = getResponseMock(token);

      expect(
        async () =>
          await authGuardMock.canActivate(getExecutionContextMock(request))
      ).rejects.toThrow(UnauthorizedException);
    };
  }

  it("should pass when ok", async () => {
    jest.spyOn(jwtServiceMock, "verifyAsync").mockResolvedValueOnce(payload);

    const request = getResponseMock("Bearer 123");

    const result = await authGuardMock.canActivate(
      getExecutionContextMock(request)
    );

    expect(result).toBe(true);
    expect(request["customer"]).toEqual(payload);
  });

  it("should pass when token missing", testFailToken(undefined));
  it("should pass when not-Bearer token", testFailToken("NotBearer 123"));
  it("should pass when token invalid Bearer token", testFailToken("Bearer 123"));
});

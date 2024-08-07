import { ApiProperty } from "@nestjs/swagger";

export class SNSConfirmationDto {
  @ApiProperty()
  SubscribeURL: string;
}


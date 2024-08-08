import { ApiProperty } from "@nestjs/swagger";

class PaymentConfirmationIdentifierDto {
  @ApiProperty()
  orderId: string;
}
export class PaymentConfirmationDto {
  @ApiProperty({ type: PaymentConfirmationIdentifierDto })
  identifier: PaymentConfirmationIdentifierDto;

  @ApiProperty()
  status: string;
}

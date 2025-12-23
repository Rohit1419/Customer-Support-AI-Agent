import { IsString, IsNotEmpty } from 'class-validator';

export class sendMessageDto {
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}

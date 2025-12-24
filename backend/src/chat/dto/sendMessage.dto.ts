import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class sendMessageDto {
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @IsString()
  @IsNotEmpty({
    message: 'Message cannot be empty , please provide some input',
  })
  @MaxLength(2000, {
    message: 'Message is too long, please keep it under 2000 characters',
  })
  message: string;
}

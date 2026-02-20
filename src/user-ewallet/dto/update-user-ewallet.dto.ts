import { PartialType } from '@nestjs/swagger';
import { CreateUserEWalletDto } from './create-user-ewallet.dto';

export class UpdateUserEwalletDto extends PartialType(CreateUserEWalletDto) {}

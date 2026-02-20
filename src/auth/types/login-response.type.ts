import { Operator } from 'src/admin/custom-dropdown/custom-dropdown/entities/operator.entity';
import { User } from '../../users/entities/user.entity';

export type LoginResponseType = Readonly<{
  token: string;
  tokenExpires: number;
  user: User;
  kycStatusName?: string;
}>;

export type OperatorLoginResponseType = Readonly<{
  token: string;
  tokenExpires: number;
  operator: Operator;
}>;

export type SocialLoginResponseType = Readonly<{
  message: string;
  data: (User & {isFirstTimeNameChange?: boolean | null, typeIb?: boolean | null});
  token: string;
  tokenExpires: number;
}>;
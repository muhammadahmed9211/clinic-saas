import { Session } from 'src/session/entities/session.entity';
import { User } from '../../../users/entities/user.entity';

export type JwtPayloadType = Pick<
  User,
  'id' | 'role' | 'languageIso' | 'email'
> & {
  sessionId: Session['id'];
  is2FAVerified: boolean;
  operator?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    is2FAVerified: boolean;
    isFirstLogin: boolean;
  };
  iat: number;
  exp: number;
  // MT5 Direct Authentication fields (optional)
  mt5Login?: string;
  mt5Server?: 'live' | 'demo';
  mt5PasswordType?: 'main' | 'investor';
};

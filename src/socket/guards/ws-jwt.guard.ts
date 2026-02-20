// import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// import { WsException } from '@nestjs/websockets';
// import { Socket } from 'socket.io';
// import * as jwt from 'jsonwebtoken';
// import { IToken } from 'src/interface/token.interface';

// @Injectable()
// export class WsJwtGuard implements CanActivate {
//   constructor() {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const client: Socket = context.switchToWs().getClient<Socket>();
//     const token = client.handshake.headers.authorization?.split(' ')[1];;

//     if (!token) {
//       throw new WsException('Unauthorized');
//     }

//     // const user = await this.authService.verifyAccessToken(token);
//     const secretKey = process.env.AUTH_JWT_SECRET;
//     if (!secretKey) {
//       throw new Error('JWT secret key not found in environment variables');
//     }
    
//     const user = jwt.verify(token, secretKey) as IToken;
//     if (!user) {
//       throw new WsException('Unauthorized');
//     }

//     client.data.user = user;
//     return true;
//   }
// }

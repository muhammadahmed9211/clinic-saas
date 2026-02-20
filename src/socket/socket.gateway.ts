// import {
//   WebSocketGateway,
//   WebSocketServer,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
//   SubscribeMessage,
// } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';
// // import { AuthService } from '../auth/auth.service';
// import { UseGuards } from '@nestjs/common';
// import { WsJwtGuard } from './guards/ws-jwt.guard';
// import * as jwt from 'jsonwebtoken';
// import { IToken } from 'src/interface/token.interface';

// @WebSocketGateway({
//   cors: {
//     origin: '*',
//   },
// })
// export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
//   @WebSocketServer() server: Server;

//   connectedUsers: Map<string, string> = new Map();

//   constructor() {}


// afterInit(server: Server) {
//   this.logger.log('WebSocket Gateway initialized');
// }

//   async handleConnection(client: Socket) {
//     const token = client.handshake.headers.authorization?.split(' ')[1];
//     if (!token) {
//       client.disconnect();
//       return;
//     }

//     // const user = await this.authService.verifyAccessToken(token);
//     const secretKey = process.env.AUTH_JWT_SECRET;
//     if (!secretKey) {
//       throw new Error('JWT secret key not found in environment variables');
//     }

//     const user = jwt.verify(token, secretKey) as IToken;
//     if (!user) {
//       client.disconnect();
//       return;
//     }

//     client.data.user = user;
//     client.join(`user_${user.id}`);
//     client.join(`notifications_${user.id}`);
//   }

//   handleDisconnect(client: Socket) {
//     // Handle disconnect logic if needed
//     this.connectedUsers.delete(client.id);
//   }

//   @UseGuards(WsJwtGuard)
//   @SubscribeMessage('newNotification')
//   sendNotificationToUser(userId: number = 2, notification: any) {
//     this.server
//       .to(`notifications_${userId}`)
//       .emit('newNotification', notification);
//   }
//   // handleSubscribeToNotifications(client: Socket) {
//   //   const userId = client.data.user.id;
//   //   client.join(`notifications_${userId}`);
//   //   console.log(`notifications_${userId}`);
//   // }

//   // Method to send notifications to a specific user
//   // sendNotificationToUser(userId: number, notification: any) {
//   //   this.server
//   //     .to(`notifications_${userId}`)
//   //     .emit('newNotification', notification);
//   // }
// }
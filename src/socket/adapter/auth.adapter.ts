// import { INestApplicationContext } from '@nestjs/common';
// import { IoAdapter } from '@nestjs/platform-socket.io';
// import * as jwt from 'jsonwebtoken';
// import { IToken } from 'src/interface/token.interface';
// import { User } from 'src/users/entities/user.entity';
// import { Repository } from 'typeorm';
// import { getRepositoryToken } from '@nestjs/typeorm';

// export class AuthIoAdapter extends IoAdapter {
//   private readonly userRepository: Repository<User>;

//   constructor(private app: INestApplicationContext) {
//     super(app);
//     this.userRepository = this.app.get(getRepositoryToken(User));
//   }

//   createIOServer(port: number, options?: any): any {
//     options.allowRequest = async (request, allowFunction) => {
//       try {
//         if (!request.headers.authorization) {
//           return allowFunction('No authorization header', false);
//         }

//         const authHeader = request.headers.authorization;
//         const token = authHeader.startsWith('Bearer ')
//           ? authHeader.split(' ')[1]
//           : authHeader;

//         if (!token) {
//           return allowFunction('No token provided', false);
//         }

//         const secretKey = process.env.AUTH_JWT_SECRET;
//         if (!secretKey) {
//           console.error('JWT secret key not found in environment variables');
//           return allowFunction('Server configuration error', false);
//         }

//         let decodedToken: IToken;
//         try {
//           decodedToken = jwt.verify(token, secretKey) as IToken;
//         } catch (error) {
//           if (error instanceof jwt.TokenExpiredError) {
//             return allowFunction('Token expired', false);
//           }
//           if (error instanceof jwt.JsonWebTokenError) {
//             return allowFunction('Invalid token', false);
//           }
//           throw error;
//         }

//         const userExists = await this.userRepository.findOne({
//           where: { id: decodedToken.id },
//         });

//         if (!userExists) {
//           return allowFunction('User not found', false);
//         }

//         return allowFunction(null, true);
//       } catch (error) {
//         console.error('Socket authentication error:', error);
//         return allowFunction('Authentication failed', false);
//       }
//     };

//     const serverOptions = {
//       ...options,
//       cors: {
//         origin: process.env.CORS_ORIGIN || '*',
//         methods: ['GET', 'POST'],
//         credentials: true,
//       },
//     };

//     return super.createIOServer(port, serverOptions);
//   }
// }

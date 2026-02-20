// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';
// import { AuthService } from 'src/auth/auth.service';

// @Injectable()
// export class MaskSensitiveDataMiddleware implements NestMiddleware {
//   constructor(
//     private readonly authService: AuthService, // Inject AuthService
//   ) {}

//   // Function to mask sensitive fields
//   private maskField(field: string, value: string): string {
//     if (field === 'email') {
//       const emailParts = value.split('@');
//       return emailParts.length === 2 ? '****@' + emailParts[1] : '****';
//     } else if (field === 'phone') {
//       return value ? '****' + value.slice(-4) : '****';
//     }
//     return '****'; // Generic masking for other fields
//   }

//   // Recursive function to traverse the object and mask fields dynamically
//   private traverseAndMaskFields(obj: any, hiddenFields: string[]) {
//     if (typeof obj !== 'object' || obj === null) return;

//     for (const key in obj) {
//       if (obj.hasOwnProperty(key)) {
//         // Check if the key is in the hiddenFields array and mask it
//         if (hiddenFields.includes(key) && typeof obj[key] === 'string') {
//           obj[key] = this.maskField(key, obj[key]);
//         }

//         // Recursively handle nested objects
//         if (typeof obj[key] === 'object') {
//           this.traverseAndMaskFields(obj[key], hiddenFields);
//         }
//       }
//     }
//   }

//   async use(req: Request, res: Response, next: NextFunction) {
//     if (req.headers.authorization) {
//       const userAuth = await this.authService.getUserByAuthToken(
//         req.user as any,
//       );
//       console.log('userAuth', userAuth);

//       // // Build the hiddenFields array based on `canSeeEmail` and `canSeePhoneNumber`
//       const hiddenFields: string[] = [];
//       // if (!userAuth.canSeeEmail) {
//       //   hiddenFields.push('email');
//       // }
//       // if (!userAuth.canSeePhoneNumber) {
//       //   hiddenFields.push('phone');
//       // }

//       // Intercept the response to mask the sensitive fields
//       const originalSend = res.send.bind(res);
//       res.send = (body: any) => {
//         if (res.statusCode >= 200 && res.statusCode < 300) {
//           // Apply the masking only if hidden fields exist
//           if (hiddenFields.length > 0) {
//             this.traverseAndMaskFields(body.data, hiddenFields);
//           }
//         }
//         // Continue with the original send function
//         return originalSend(body);
//       };
//     }
//   }

//   next(); // Continue to the next middleware or route handler
// }

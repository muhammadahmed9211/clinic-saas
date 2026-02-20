import { Global, Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';

@Global()
@Module({
  providers: [
    {
      provide: 'FIREBASE_ADMIN',
      inject: [ConfigService],
      useFactory: (config: ConfigService<AllConfigType>) => {
        const firebaseConfig = config.getOrThrow('firebase');

        return admin.initializeApp({
          credential: admin.credential.cert({
            projectId: firebaseConfig.firebaseProjectId,
            clientEmail: firebaseConfig.firebaseClientEmail,
            privateKey: firebaseConfig.firebasePrivateKey,
          }),
        });
      },
    },
    FirebaseService,
  ],
  exports: [FirebaseService, 'FIREBASE_ADMIN'],
})
export class FirebaseModule {}

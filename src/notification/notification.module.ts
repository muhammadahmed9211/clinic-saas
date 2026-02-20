import { forwardRef, Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { notifications } from './entity/notification.entity';
import { Label } from 'src/tasks/entities/label.entity';
import { LabelTranslation } from 'src/tasks/entities/label_translation.entity';
import { FileEntity } from 'src/files/entities/file.entity';
import { FilesService } from 'src/files/files.service';
import { TransactionRepository } from 'src/transaction/repositories/transaction.repository';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { SocketModule } from 'src/socket/socket.module';
import { User } from 'src/users/entities/user.entity';
import { NotificationMessages } from './entity/notification_messages.entity';
import { NotificationLabelRepository } from './repositories/notification_label.repository';
import { EmailAttachments } from 'src/mail/entities/emailAttachments.entity';
// import { SocketGateway } from 'src/socket/socket.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      notifications,
      Label,
      LabelTranslation,
      FileEntity,
      Transaction,
      User,
      NotificationMessages,
      EmailAttachments
    ]),
    SocketModule,
  ],
  controllers: [NotificationController],
  providers: [
    NotificationLabelRepository,
    NotificationService,
    FilesService,
    TransactionRepository,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}

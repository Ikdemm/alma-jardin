import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ContactMessage,
  ContactMessageSchema,
} from '../schemas/contact-message.schema';
import { SettingsModule } from '../settings/settings.module';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ContactMessage.name, schema: ContactMessageSchema },
    ]),
    SettingsModule,
  ],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}

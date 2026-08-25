import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { Admin, AdminSchema } from '../schemas/admin.schema';
import { Role, RoleSchema } from '../schemas/role.schema';
import { AdminsController } from './admins.controller';
import { AdminsService } from './admins.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: Role.name, schema: RoleSchema },
    ]),
  ],
  controllers: [AdminsController],
  providers: [AdminsService],
})
export class AdminsModule {}

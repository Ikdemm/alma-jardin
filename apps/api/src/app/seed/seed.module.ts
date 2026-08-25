import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { Admin, AdminSchema } from '../schemas/admin.schema';
import { Role, RoleSchema } from '../schemas/role.schema';
import { SeedService } from './seed.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: Role.name, schema: RoleSchema },
    ]),
  ],
  providers: [SeedService],
})
export class SeedModule {}

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { PasswordService } from '../common/password.service';
import { Admin, AdminSchema } from '../schemas/admin.schema';
import { Role, RoleSchema } from '../schemas/role.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'dev-secret-change-me'),
        signOptions: {
          expiresIn: config.get('JWT_EXPIRES_IN', '7d') as `${number}d`,
        },
      }),
    }),
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: Role.name, schema: RoleSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PasswordService],
  exports: [AuthService, PasswordService, JwtModule],
})
export class AuthModule {}


import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { BullModule } from '@nestjs/bull';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './google.strategy';
import { MicrosoftStrategy } from './microsoft.strategy';
import { MicrosoftAuthController } from './microsoft-auth.controller';

@Module({
    imports: [
        UserModule,
        PassportModule,
        BullModule.registerQueue({
            name: 'drive-queue',
        }),
        BullModule.registerQueue({
            name: 'teams-queue',
        }),
    ],
    controllers: [AuthController, MicrosoftAuthController],
    providers: [AuthService, GoogleStrategy, MicrosoftStrategy],
})
export class AuthModule { }

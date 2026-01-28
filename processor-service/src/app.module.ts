import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DriveProcessor } from './drive/drive.processor';
import { TeamsProcessor } from './teams/teams.processor';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),
    BullModule.registerQueue({
      name: 'drive-queue',
    }),
    BullModule.registerQueue({
      name: 'teams-queue',
    }),
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService, DriveProcessor, TeamsProcessor],
})
export class AppModule { }

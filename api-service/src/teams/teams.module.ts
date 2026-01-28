
import { Module } from '@nestjs/common';
import { TeamsController } from './teams.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './team.entity';
import { TeamsService } from './teams.service';
import { UserModule } from '../user/user.module';

@Module({
    imports: [TypeOrmModule.forFeature([Team]), UserModule],
    controllers: [TeamsController],
    providers: [TeamsService],
})
export class TeamsModule { }

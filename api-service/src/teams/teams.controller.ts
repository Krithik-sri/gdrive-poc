
import { Controller, Post, Body, Logger, Get, Req } from '@nestjs/common';
import type { Request } from 'express';
import { TeamsService } from './teams.service';

@Controller('teams')
export class TeamsController {
    private readonly logger = new Logger(TeamsController.name);

    constructor(private readonly teamsService: TeamsService) { }

    @Post()
    async receiveTeamsData(@Body() data: any) {
        this.logger.log(`Received Teams data for ${data.email}`);
        this.logger.log(`Data count: ${data.teams?.length || 0} teams`);
        await this.teamsService.saveTeams(data.email, data.teams);
        return { status: 'success' };
    }

    @Get()
    async getTeams(@Req() req: Request) {
        const email = req.query.email as string;
        if (!email) return [];
        return this.teamsService.getTeams(email);
    }
}


import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import type { Job } from 'bull';
import { Client } from '@microsoft/microsoft-graph-client';
import 'isomorphic-fetch';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Processor('teams-queue')
export class TeamsProcessor {
    private readonly logger = new Logger(TeamsProcessor.name);

    constructor(private readonly httpService: HttpService) { }

    @Process('sync')
    async handleSync(job: Job) {
        this.logger.debug('Start syncing Teams data...');
        const { user } = job.data;

        if (!user || !user.microsoftAccessToken) {
            this.logger.error('No Microsoft user token found');
            return;
        }

        const client = Client.init({
            authProvider: (done) => {
                done(null, user.microsoftAccessToken);
            },
        });

        try {
            this.logger.log(`Fetching joined teams for user ${user.email}`);

            const joinedTeams = await client.api('/me/joinedTeams').get();
            const teams = joinedTeams.value;

            if (teams?.length) {
                this.logger.log(`Found ${teams.length} teams. Sending to API service...`);
                const apiUrl = process.env.API_SERVICE_URL || 'http://localhost:3000';
                const teamsWithChannels = await Promise.all(teams.map(async (team: any) => {
                    try {
                        const channels = await client.api(`/teams/${team.id}/channels`).get();
                        return { ...team, channels: channels.value };
                    } catch (e) {
                        this.logger.warn(`Failed to fetch channels for team ${team.id}`, e);
                        return team;
                    }
                }));

                await lastValueFrom(
                    this.httpService.post(`${apiUrl}/teams`, {
                        email: user.email,
                        teams: teamsWithChannels
                    })
                );
                this.logger.log('Teams data sent to API service successfully.');
            } else {
                this.logger.log('No joined teams found.');
            }
        } catch (error) {
            this.logger.error('Error syncing Teams data', error);
            //use refresh token here
        }
    }
}


import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import type { Job } from 'bull';
import { google } from 'googleapis';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Processor('drive-queue')
export class DriveProcessor {
    private readonly logger = new Logger(DriveProcessor.name);

    constructor(private readonly httpService: HttpService) { }

    @Process('sync')
    async handleSync(job: Job) {
        this.logger.debug('Start syncing...');
        const { user } = job.data;
        if (!user || !user.accessToken) {
            this.logger.error('No user token found');
            return;
        }

        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
        );
        oauth2Client.setCredentials({ access_token: user.accessToken, refresh_token: user.refreshToken });

        const drive = google.drive({ version: 'v3', auth: oauth2Client });

        try {
            this.logger.log(`Fetching files for user ${user.email}`);
            const res = await drive.files.list({
                pageSize: 10,
                fields: 'nextPageToken, files(id, name, mimeType, webViewLink, iconLink)',
            });

            const files = res.data.files;
            if (files?.length) {
                this.logger.log(`Found ${files.length} files. Sending to API service...`);
                // Send to API Service
                // Ideally use an internal DNS or localhost port. 
                // Assuming API service is on localhost:3000 for local POC.
                // In Docker, it handles networking differently (service name).
                // I will use process.env.API_URL or default to localhost:3000
                const apiUrl = process.env.API_SERVICE_URL || 'http://localhost:3000';

                await lastValueFrom(
                    this.httpService.post(`${apiUrl}/files`, {
                        email: user.email,
                        files: files.map(f => ({
                            googleId: f.id,
                            name: f.name,
                            mimeType: f.mimeType,
                            webViewLink: f.webViewLink,
                            iconLink: f.iconLink
                        }))
                    })
                );
                this.logger.log('Files sent to API service successfully.');
            } else {
                this.logger.log('No files found.');
            }
        } catch (error) {
            this.logger.error('Error syncing files', error);
            // Handle token expiry and refresh flow if needed here?
            // googleapis automatically handles refresh if refresh_token is set!
        }
    }
}

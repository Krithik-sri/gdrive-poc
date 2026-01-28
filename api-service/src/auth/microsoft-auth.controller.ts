
import { Controller, Get, Req, UseGuards, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Response, Request } from 'express';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';

@Controller('auth')
export class MicrosoftAuthController {
    constructor(@InjectQueue('teams-queue') private teamsQueue: Queue) { }

    @Get('microsoft')
    @UseGuards(AuthGuard('microsoft'))
    async microsoftAuth(@Req() req: Request) { }

    @Get('microsoft/callback')
    @UseGuards(AuthGuard('microsoft'))
    async microsoftAuthRedirect(@Req() req: Request, @Res() res: Response) {
        await this.teamsQueue.add('sync', {
            user: (req as any).user,
        });

        res.redirect(`http://localhost:5173/dashboard?status=success&email=${(req as any).user.email}&provider=microsoft`);
    }
}

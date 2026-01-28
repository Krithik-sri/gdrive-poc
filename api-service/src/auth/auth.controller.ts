
import { Controller, Get, Req, UseGuards, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Response, Request } from 'express';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';

@Controller('auth')
export class AuthController {
    constructor(@InjectQueue('drive-queue') private driveQueue: Queue) { }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req: Request) { }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
        await this.driveQueue.add('sync', {
            user: (req as any).user,
        });
        // Successful authentication, redirect to frontend
        // In a real app we set a JWT cookie here.
        res.redirect(`http://localhost:5173/dashboard?status=success&email=${(req as any).user.email}`);
    }
}


import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-microsoft';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class MicrosoftStrategy extends PassportStrategy(Strategy, 'microsoft') {
    constructor(private authService: AuthService) {
        super({
            clientID: process.env.MICROSOFT_CLIENT_ID || '',
            clientSecret: process.env.MICROSOFT_CLIENT_SECRET || '',
            callbackURL: process.env.MICROSOFT_REDIRECT_URL || 'http://localhost:3003/v2/auth/microsoft/callback',
            scope: ['User.Read', 'Team.ReadBasic.All', 'Channel.ReadBasic.All'],
            tenant: process.env.MICROSOFT_TENANT_ID || 'common',
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: Function,
    ): Promise<any> {
        const { name, emails } = profile;
        const email = emails && emails.length > 0 ? emails[0].value : null;

        if (!email) {
            return done(new Error('No email found from Microsoft provider'), null);
        }

        const user = await this.authService.validateUser({
            email: email,
            firstName: name.givenName,
            lastName: name.familyName,
            microsoftAccessToken: accessToken,
            microsoftRefreshToken: refreshToken,
        });
        done(null, user);
    }
}

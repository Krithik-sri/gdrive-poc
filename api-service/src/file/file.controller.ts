
import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import type { Request } from 'express';
import { FileService } from './file.service';
import { UserService } from '../user/user.service';

@Controller('files')
export class FileController {
    constructor(
        private readonly fileService: FileService,
        private readonly userService: UserService,
    ) { }

    @Get()
    async findAll(@Req() req: Request) {
        // For simplicity in POC, passing userId in query or assume no AuthGuard yet on this endpoint?
        // User wants frontend to show files.
        // Ideally we usage AuthGuard, but for POC let's accept userId via query or email.
        // But frontend won't have userId easily unless we passed it back in "redirect".
        // Let's use email query param for now for simplicity.
        const email = req.query.email as string;
        if (!email) return [];
        const user = await this.userService.findByEmail(email);
        if (!user) return [];
        return this.fileService.findAll(user.id);
    }

    @Post()
    async create(@Body() body: any) {
        // Body: { userId: number, files: [...] } or { email: string, files: [...] }
        const { email, files } = body;
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }
        return this.fileService.createMany(files, user);
    }
}

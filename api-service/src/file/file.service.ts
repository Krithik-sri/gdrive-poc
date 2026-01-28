
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './file.entity';
import { User } from '../user/user.entity';

@Injectable()
export class FileService {
    constructor(
        @InjectRepository(File)
        private fileRepository: Repository<File>,
    ) { }

    async findAll(userId: number): Promise<File[]> {
        return this.fileRepository.find({ where: { user: { id: userId } } });
    }

    async createMany(filesData: Partial<File>[], user: User): Promise<File[]> {
        const files = filesData.map((f) => this.fileRepository.create({ ...f, user }));
        return this.fileRepository.save(files);
    }
}

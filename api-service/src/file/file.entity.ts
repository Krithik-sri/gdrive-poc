
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class File {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    googleId: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    mimeType: string;

    @Column({ nullable: true })
    webViewLink: string;

    @Column({ nullable: true })
    iconLink: string;

    @ManyToOne(() => User, (user) => user.files)
    user: User;
}

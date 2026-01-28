
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { File } from '../file/file.entity';
import { Team } from '../teams/team.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    firstName: string;

    @Column({ nullable: true })
    lastName: string;

    @Column({ nullable: true })
    picture: string;

    @Column({ nullable: true })
    accessToken: string;

    @Column({ nullable: true })
    refreshToken: string;

    @Column({ nullable: true })
    microsoftAccessToken: string;

    @Column({ nullable: true })
    microsoftRefreshToken: string;

    @OneToMany(() => File, (file) => file.user)
    files: File[];

    @OneToMany(() => Team, (team) => team.user)
    teams: Team[];
}

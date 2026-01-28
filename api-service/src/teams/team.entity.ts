
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Team {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    paxiaiId: string; // ID from Microsoft Graph

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    webUrl: string;

    @ManyToOne(() => User, (user) => user.teams)
    user: User;
}

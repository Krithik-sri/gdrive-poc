
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './team.entity';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class TeamsService {
    constructor(
        @InjectRepository(Team)
        private teamsRepository: Repository<Team>,
        private userService: UserService,
    ) { }

    async saveTeams(email: string, teamsData: any[]) {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }
        await this.teamsRepository.delete({ user: { id: user.id } });

        const teams = teamsData.map(team => {
            const newTeam = new Team();
            newTeam.paxiaiId = team.id;
            newTeam.name = team.displayName || team.name;
            newTeam.description = team.description;
            newTeam.webUrl = team.webUrl;
            newTeam.user = user;
            return newTeam;
        });

        return this.teamsRepository.save(teams);
    }

    async getTeams(email: string): Promise<Team[]> {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            return [];
        }
        return this.teamsRepository.find({ where: { user: { id: user.id } } });
    }
}

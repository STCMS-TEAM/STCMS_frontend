import { Team, Tournament } from './tournament';

export interface MatchDTO {
  startDate: string;
  tournament: Tournament[];
  teams: Team[];
  status: 'pending' | 'in_progress' | 'completed' | string;
  result: {
    score: Record<string, number>;
  };
}

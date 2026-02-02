import { Team, Tournament } from './tournament';

export interface MatchDTO {
  _id?: string;
  startDate: string;
  tournament?: Tournament | string;
  teams: (Team & { _id?: string })[];
  status: 'pending' | 'live' | 'in_progress' | 'completed' | string;
  result: {
    score: Record<string, number>;
  };
}

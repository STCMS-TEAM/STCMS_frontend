export interface TournamentForm {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  type: string;
  sport: string;
}
export interface Tournament {
  _id: string;
  id: string;
  name: string;
  description: string;
  createdBy: CreatedBy;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  type: 'single_elimination' | 'double_elimination' | 'round_robin' | string;
  sport: 'soccer' | 'basketball' | 'volleyball' | 'cycling' | 'athletics' | string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
  teams: Team[];
  matches: Match[];
}

export interface CreatedBy {
  _id: string;
  id: string;
  name: string;
  last_name: string;
  email: string;
}

export interface Team {
  _id?: string;
  name?: string;
  members?: string[];
}

export interface TeamListItem {
  _id: string;
  name: string;
  tournament?: string;
  captain?: string;
  players?: string[];
}

export interface TeamWithPlayers {
  _id: string;
  name: string;
  players: { _id: string; name: string; email?: string }[];
}

export interface Match {
  _id?: string;
  round?: number;
  teamA?: string;
  teamB?: string;
  scoreA?: number;
  scoreB?: number;
  winner?: string;
}

export interface createTeam {
  name: string;
  players: string[];
}

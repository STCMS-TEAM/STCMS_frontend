import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  createTeam,
  Tournament,
  TournamentForm,
  TeamListItem,
  TeamWithPlayers,
} from '../../../shared/models/tournament';
import { Match } from '../../../shared/models/matches';

@Injectable({ providedIn: 'root' })
export class ResultsService {
  private readonly baseUrl = `${environment.API_DEV_URL}/tournaments`;
  private http = inject(HttpClient);

  private _showMatches = signal(false);
  private _selectedSport = signal('soccer');
  private _selectedTournament = signal<Tournament>(null as any);

  showMatches = computed(() => this._showMatches());
  selectedSport = computed(() => this._selectedSport());
  selectedTournament = computed(() => this._selectedTournament());

  toggleShowMatches() {
    this._showMatches.set(!this._showMatches());
  }

  toggleSport(sport: string) {
    this._selectedSport.set(sport);
  }

  toggleTournament(tournament: Tournament) {
    this._selectedTournament.set(tournament);
  }

  tournaments = signal<Tournament[]>([]);
  matchesOfTournament = signal<Match[]>([]);

  setTournaments(tournaments: Tournament[]) {
    this.tournaments.set(tournaments);
  }

  setMatchesOfTournament(matches: Match[] | any) {
    let matchesArray: Match[] = [];

    if (Array.isArray(matches)) {
      matchesArray = matches;
    } else if (matches && typeof matches === 'object') {
      matchesArray = matches.matches || matches.data || matches.items || [];
    }

    if (!Array.isArray(matchesArray)) {
      matchesArray = [];
    }

    const seen = new Set<string>();
    const unique: Match[] = [];
    for (const m of matchesArray) {
      const id = (m as any)._id ?? (m as any).id;
      let key: string;
      if (id != null) {
        key = String(id);
      } else {
        const t0 = (m as any).teams?.[0];
        const t1 = (m as any).teams?.[1];
        const n0 = String(t0?._id ?? t0?.id ?? t0?.name ?? '').trim().toLowerCase();
        const n1 = String(t1?._id ?? t1?.id ?? t1?.name ?? '').trim().toLowerCase();
        const dateRaw = (m as any).startDate ?? '';
        const date = typeof dateRaw === 'string' ? dateRaw.slice(0, 19) : String(dateRaw);
        key = [date, n0, n1].sort().join('|');
      }
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(m);
      }
    }
    this.matchesOfTournament.set(unique);
  }

  clearTournaments() {
    this.tournaments.set([]);
  }

  public createTournament(tournament: TournamentForm): Observable<TournamentForm> {
    return this.http.post<TournamentForm>(`${this.baseUrl}`, tournament);
  }

  public getTournamentsById(id: string): Observable<Tournament[]> {
    return this.http.get<Tournament[]>(`${this.baseUrl}?sport=${id}`);
  }
  public getTournamentsBySport(sportName: string): Observable<Tournament[]> {
    return this.http.get<Tournament[]>(`${this.baseUrl}?sport=${sportName}`);
  }

  getTournaments(filters?: { [key: string]: any }): Observable<Tournament[]> {
    let params = new HttpParams();

    if (filters) {
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          params = params.append(key, filters[key]);
        }
      });
    }

    return this.http.get<Tournament[]>(this.baseUrl, { params });
  }

  public createTeam(id: string, team: createTeam): Observable<createTeam> {
    return this.http.post<createTeam>(`${this.baseUrl}/${id}/teams`, team);
  }

  public getAllTeamsByTournament(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}/matches`);
  }

  getTeamsByTournament(tournamentId: string): Observable<TeamListItem[]> {
    return this.http.get<TeamListItem[]>(`${this.baseUrl}/${tournamentId}/teams`);
  }

  getTeamById(teamId: string): Observable<TeamWithPlayers> {
    return this.http.get<TeamWithPlayers>(`${environment.API_DEV_URL}/teams/${teamId}`);
  }

  createMatch(tournamentId: string, teams: string[], startDate: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${tournamentId}/matches`, { teams, startDate });
  }

  deleteTournament(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }
}

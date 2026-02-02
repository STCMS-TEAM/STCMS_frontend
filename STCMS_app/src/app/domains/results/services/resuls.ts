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
  RankingEntry,
} from '../../../shared/models/tournament';
import { MatchDTO } from '../../../shared/models/matches';

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
  // Signal holds the matches array reactively
  matchesOfTournament = signal<MatchDTO[]>([]);

  setTournaments(tournaments: Tournament[]) {
    this.tournaments.set(tournaments);
  }

  setMatchesOfTournament(matches: MatchDTO[]) {
    this.matchesOfTournament.set(matches);
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

  public getAllTeamsByTournament(id: string): Observable<Tournament> {
    return this.http.get<Tournament>(`${this.baseUrl}/${id}/matches`);
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

  getRankings(tournamentId: string): Observable<RankingEntry[]> {
    return this.http.get<RankingEntry[]>(`${this.baseUrl}/${tournamentId}/rankings`);
  }

  updateMatchResult(matchId: string, score: Record<string, number>): Observable<any> {
    return this.http.patch<any>(`${environment.API_DEV_URL}/matches/${matchId}/result`, { score });
  }

  updateMatchStatus(matchId: string, status: 'pending' | 'live' | 'completed'): Observable<any> {
    return this.http.patch<any>(`${environment.API_DEV_URL}/matches/${matchId}/status`, { status });
  }
}

import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createTeam, Tournament, TournamentForm } from '../../../shared/models/tournament';
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

  // Signal holds the tournaments array reactively
  tournaments = signal<Tournament[]>([]);
  // Signal holds the matches array reactively
  matchesOfTournament = signal<Match[]>([]);

  // Setter method to update the signal
  setTournaments(tournaments: Tournament[]) {
    this.tournaments.set(tournaments);
  }

  setMatchesOfTournament(matches: Match[] | any) {
    // Extract array from response if it's an object with 'matches' property
    let matchesArray: Match[] = [];
    
    if (Array.isArray(matches)) {
      matchesArray = matches;
    } else if (matches && typeof matches === 'object') {
      // Try to extract from common response formats
      matchesArray = matches.matches || matches.data || matches.items || [];
    }
    
    // Ensure it's always an array
    if (!Array.isArray(matchesArray)) {
      console.warn('⚠️ setMatchesOfTournament: matchesArray is not an array:', matchesArray);
      matchesArray = [];
    }
    
    this.matchesOfTournament.set(matchesArray);
  }

  // Optional helper to clear it
  clearTournaments() {
    this.tournaments.set([]);
  }

  // TOURNAMENT API
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

    // If filters exist, append them as query parameters
    if (filters) {
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          params = params.append(key, filters[key]);
        }
      });
    }

    // Send GET request with or without params
    return this.http.get<Tournament[]>(this.baseUrl, { params });
  }

  // TEAM API

  public createTeam(id: string, team: createTeam): Observable<createTeam> {
    return this.http.post<createTeam>(`${this.baseUrl}/${id}/teams`, team);
  }

  public getAllTeamsByTournament(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}/matches`);
  }
}

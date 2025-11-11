import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../../core/auth/services/auth';
import { createTeam, Tournament, TournamentForm } from '../../../shared/models/tournament';
import { Match } from '../../../shared/models/matches';

@Injectable({ providedIn: 'root' })
export class ResultsService {
  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private authService = inject(AuthService);

  private readonly baseUrl = `${environment.API_DEV_URL}/tournaments`;

  // Signal holds the tournaments array reactively
  tournaments = signal<Tournament[]>([]);
  // Signal holds the matches array reactively
  matchesOfTournament = signal<Match[]>([]);

  // Setter method to update the signal
  setTournaments(tournaments: Tournament[]) {
    this.tournaments.set(tournaments);
  }

  setMatchesOfTournament(matches: Match[]) {
    this.matchesOfTournament.set(matches);
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

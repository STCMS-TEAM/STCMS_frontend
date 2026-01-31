import { DestroyRef, Injectable, computed, effect, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthResponse, User } from '../../models/auth';
import { environment } from '../../../../environments/environment.development';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

type AuthState = {
  user: User | null;
  token: string | null;
  isAuth: boolean;
  loading: boolean;
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  private readonly baseUrl = `${environment.API_DEV_URL}/auth`;
  private _accessTokenKey = 'accessToken';
  private _storedToken = sessionStorage.getItem(this._accessTokenKey);

  private _state = signal<AuthState>({
    user: null,
    token: this._storedToken,
    isAuth: this._storedToken !== null, // You may check the token validity here
    loading: false,
  });

  // You cannot directly assign values to a computed signal.
  token = computed(() => this._state().token);
  loading = computed(() => this._state().loading);
  isAuth = computed(() => this._state().isAuth);
  user = computed(() => this._state().user);

  constructor() {
    effect(() => {
      const token = this.token();
      if (token !== null) {
        sessionStorage.setItem(this._accessTokenKey, token);
      } else {
        sessionStorage.removeItem(this._accessTokenKey);
      }
    });
  }

  // if that is used globaly then call the subscribe in service
  login(email: string, password: string): void {
    // Update loading state before sending request
    this._state.update((s) => ({ ...s, loading: true }));
    // withCredentials: true allow to us:
    // Send cookies along with the request.
    // Accept and store cookies (Set-Cookie) from the response.
    this.http
      .post<AuthResponse>(`${this.baseUrl}/login`, { email, password }, { withCredentials: true })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          (this._state.update(() => ({
            user: response.user,
            token: response.accessToken,
            isAuth: true,
            loading: false,
          })),
            this.router.navigate(['/home']));
        },
        error: (err) => {
          console.log('This is login errror: ', err);
        },
      });
  }

  register(user: User): void {
    this._state.update((s) => ({ ...s, loading: true }));
    // TODO register part
    this.http
      .post<AuthResponse>(`${this.baseUrl}/register`, user, { withCredentials: true })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          (this._state.update(() => ({
            user: response.user,
            token: response.accessToken,
            isAuth: true,
            loading: false,
          })),
            this.router.navigate(['/home']));
        },
        error: (err) => {
          console.log('This is register errror: ', err);
        },
      });
  }

  logout(): void {
    // Remove access token from sessionStorage
    sessionStorage.removeItem(this._accessTokenKey);

    // Optional: call backend to invalidate refresh token
    this.http
      .post(`${this.baseUrl}/logout`, {}, { withCredentials: true })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          // Reset local state
          this._state.update(() => ({
            user: null,
            token: null,
            isAuth: false,
            loading: false,
          }));
        },
        error: (err) => console.error('Logout failed', err),
      });
  }

  getToken(): string | null {
    return sessionStorage.getItem(this._accessTokenKey);
  }

  clearToken(): void {
    sessionStorage.removeItem(this._accessTokenKey);
  }
}

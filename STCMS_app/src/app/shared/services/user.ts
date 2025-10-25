import { HttpClient, HttpParams } from '@angular/common/http';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { PaginatedResponse } from '../models/paginated-response';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  private readonly baseUrl = `${environment.API_DEV_URL}/users`;

  getUser(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${userId}`);
  }

  getUserByPagination(page: number = 1, limit: number = 2): Observable<PaginatedResponse<User>> {
    const params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.get<PaginatedResponse<User>>(this.baseUrl, { params });
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${userId}`);
  }
}

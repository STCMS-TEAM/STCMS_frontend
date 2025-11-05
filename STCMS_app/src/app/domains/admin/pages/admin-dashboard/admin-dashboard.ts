import { Component, DestroyRef, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../../../shared/services/user';
import { User } from '../../../../shared/models/user';
import { PaginatedResponse } from '../../../../shared/models/paginated-response';
import { CommonModule } from '@angular/common';
import { Paginator } from '../../../../shared/components/paginator/paginator';

@Component({
  selector: 'app-admin-dashboard',
  imports: [Paginator, CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {
  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private userService = inject(UserService);

  users: User[] = [];
  total = 0;
  page = 1;
  limit = 2;
  totalPages = 0;

  ngOnInit(): void {
    this.loadUsers();
    console.log(this.users);
  }

  loadUsers(): void {
    this.userService.getUserByPagination(this.page, this.limit).subscribe({
      next: (res: PaginatedResponse<User>) => {
        this.users = res.items;
        this.total = res.meta.totalItems;
        this.totalPages = res.meta.totalPages;
      },
      error: (err) => console.error('Error loading users:', err),
    });
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.loadUsers();
  }

  deleteUser(id: string): void {
    this.userService.deleteUser(id).subscribe({
      next: () => this.loadUsers(),
      error: (err) => console.error('Delete failed', err),
    });
  }
}

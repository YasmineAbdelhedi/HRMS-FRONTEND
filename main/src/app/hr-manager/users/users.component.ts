import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { UserDialogComponent } from 'src/app/admin/users/user-dialog.component';

@Component({
  selector: 'app-hr-users',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class HRUsersComponent implements OnInit {
  dataSource = new MatTableDataSource<User>([]);
  displayedColumns: string[] = ['fullName', 'email', 'roles', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.dataSource.data = users || [];
        setTimeout(() => {
          if (this.paginator) this.dataSource.paginator = this.paginator;
          if (this.sort) this.dataSource.sort = this.sort;
        });
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Failed to load users', 'Close', { duration: 3000 });
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openCreate(): void {
    const ref = this.dialog.open(UserDialogComponent, { data: { mode: 'create' }, width: '480px' });
    ref.afterClosed().subscribe((res) => {
      if (res === 'saved') this.loadUsers();
    });
  }

  openEdit(user: User): void {
    const ref = this.dialog.open(UserDialogComponent, { data: { mode: 'edit', user }, width: '480px' });
    ref.afterClosed().subscribe((res) => {
      if (res === 'saved') this.loadUsers();
    });
  }

  deleteUser(user: User): void {
    if (!confirm(`Delete user ${user.fullName}?`)) return;
    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.snackBar.open('User deleted', 'Close', { duration: 2000 });
        this.loadUsers();
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Failed to delete user', 'Close', { duration: 3000 });
      }
    });
  }

  roleNames(user: User): string {
    return (user.roles || []).map((role) => role.name).join(', ');
  }
}

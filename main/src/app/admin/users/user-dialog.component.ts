import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MaterialModule } from 'src/app/material.module';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RegisterUserDto, User } from 'src/app/models/user.model';

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule, MatChipsModule],
  templateUrl: './user-dialog.component.html',
})
export class UserDialogComponent {
  form = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: [''],
    role: [[] as string[]],
  });

  roles = ['ADMIN', 'EMPLOYEE', 'HR_MANAGER', 'PROJECT_MANAGER'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
    if (data?.mode === 'edit' && data.user) {
      this.form.patchValue({
        fullName: data.user.fullName,
        email: data.user.email,
        role: (data.user.roles || []).map((r: { name: string }) => r.name),
      });
    } else {
      this.form.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.form.get('password')?.updateValueAndValidity();
    }
  }

  toggleRole(role: string) {
    const current: string[] = this.form.value.role || [];
    const idx = current.indexOf(role);
    if (idx > -1) {
      current.splice(idx, 1);
    } else {
      current.push(role);
    }
    this.form.patchValue({ role: current as any });
  }

  save() {
    if (this.form.invalid) return;
    const payload = this.form.value;
    const roles = payload.role || [];

    if (this.data?.mode === 'edit' && this.data.user) {
      const body: Partial<User> = {
        fullName: payload.fullName || undefined,
        email: payload.email || undefined,
        roles: roles.map((role) => ({ id: 0, name: role, authority: role })),
      };

      this.userService.updateUser(this.data.user.id, body).subscribe({
        next: () => {
          this.snackBar.open('User updated', 'Close', { duration: 2000 });
          this.dialogRef.close('saved');
        },
        error: (e) => {
          console.error(e);
          this.snackBar.open('Failed to update user', 'Close', { duration: 3000 });
        }
      });
    } else {
      const body: RegisterUserDto = {
        fullName: payload.fullName || '',
        email: payload.email || '',
        password: payload.password || '',
        roles,
      };

      this.userService.createUser(body).subscribe({
        next: () => {
          this.snackBar.open('User created', 'Close', { duration: 2000 });
          this.dialogRef.close('saved');
        },
        error: (e) => {
          console.error(e);
          this.snackBar.open('Failed to create user', 'Close', { duration: 3000 });
        }
      });
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}

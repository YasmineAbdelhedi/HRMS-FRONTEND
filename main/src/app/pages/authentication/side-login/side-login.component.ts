import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../services/auth.service';  // Import AuthService

@Component({
  selector: 'app-side-login',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './side-login.component.html',
  styleUrls: ['./side-login.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppSideLoginComponent {
  constructor(private router: Router, private authService: AuthService) { }

  // Define form with validators
  loginform = new FormGroup({
    email: new FormControl(),
    password: new FormControl(),
  });

  get f() {
    return this.loginform.controls;
  }

  // Submit method to handle the form submission
  submit() {
    if (this.loginform.invalid) {
      return; // Prevent submission if form is invalid
    }

    const { email, password } = this.loginform.value;
    const loginData = { email, password };
    this.authService.login(loginData).subscribe(
      (response) => {
        // On success, store token or do other actions as necessary
        console.log('Login successful', response);
        // Ensure token is saved (AuthService.login uses tap to save, but be defensive)
        if (response && response.token) {
          try {
            this.authService.saveToken(response.token);
          } catch (e) {
            // eslint-disable-next-line no-console
            console.warn('[side-login] saveToken failed', e);
          }
        }

        this.authService.resolvePostLoginRoute().subscribe({
          next: (redirectPath) => {
            this.router.navigateByUrl(redirectPath);
          },
          error: () => {
            this.router.navigateByUrl('/authentication/login');
          }
        });
      },
      (error) => {
        // Handle error response
        console.error('Login error', error);
        // Optionally display an error message to the user
      }
    );
  }
}

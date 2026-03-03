import { Component } from '@angular/core';
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
  selector: 'app-side-register',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './side-register.component.html',
})
export class AppSideRegisterComponent {
  constructor(private router: Router, private authService: AuthService) { }

  // Initialize the form
  registerForm = new FormGroup({
    fullName: new FormControl(),
    email: new FormControl(),
    password: new FormControl(),
    roles: new FormControl(),
  });

  // Getter for easy access to form controls
  get f() {
    return this.registerForm.controls;
  }

  // Submit method to handle the form submission
  submit() {
    if (this.registerForm.invalid) {
      return; // Prevent submission if form is invalid
    }

    const { fullName, email, password, roles } = this.registerForm.value;
    const registerData = { fullName, email, password, roles };

    // Call AuthService to register the user
    this.authService.signup(registerData).subscribe(
      (response) => {
        // Handle successful registration (redirect to login page or show success message)
        console.log('Registration successful', response);
        this.router.navigate(['/authentication/login']);  // Redirect to login page after registration
      },
      (error) => {
        // Handle error response
        console.error('Registration error', error);
      }
    );
  }
}

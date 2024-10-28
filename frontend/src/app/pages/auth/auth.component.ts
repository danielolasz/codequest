import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmCardModule } from '@spartan-ng/ui-card-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmH1Directive, HlmH3Directive } from '@spartan-ng/ui-typography-helm';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ApiService } from '../../shared/api/api.service';
import { User } from '../../shared/models/user.model';
import { AuthService } from '../../shared/auth/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HlmCardModule,
    HlmButtonDirective,
    HlmInputDirective,
    HlmH3Directive,
    HlmH1Directive
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  authForm: FormGroup;
  isLogin = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService
  ) {
    this.authForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      role: ['developer', Validators.required]
    });
  }

  login() {
    const credentials = { email: this.authForm.value.email, password: this.authForm.value.password };
    this.apiService.post<{ token: string, user: User }>('auth/login', credentials)
      .subscribe(response => {
        if (response && response.token) {
          localStorage.setItem('jwtToken', response.token);
          this.authService.setUser(response.user);
          this.router.navigateByUrl('/tickets');
        }
      });
  }

  signup() {
    if (this.authForm.valid && this.isPasswordMatch()) {
      const newUser = this.authForm.value;
      this.apiService.post<{ token: string, user: User }>('users/signup', newUser)
        .subscribe(response => {
          if (response) {
            console.log(response);
            this.authService.setUser(response.user);
            localStorage.setItem('jwtToken', response.token);
            this.router.navigateByUrl('/tickets');
          }
        });
    }
  }

  isPasswordMatch(): boolean {
    return this.authForm.value.password === this.authForm.value.confirmPassword;
  }
}

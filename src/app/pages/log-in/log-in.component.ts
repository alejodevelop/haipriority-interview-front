import {Component, signal} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule, MatError} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {LoginData} from "./dto/loginData";
import {LoginResponse} from "./dto/loginResponse";
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatError, MatIcon, MatIconButton, MatButton, NgOptimizedImage],
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent {
  hide = signal(true);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });
  loginErrorResponse: string = '';

  constructor(private authService: AuthService) {
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }


  onSubmit(event: Event) {
    event.preventDefault();

    if (this.loginForm.valid) {
      const loginData: LoginData = {
        username: this.loginForm.value.email as NonNullable<string>,
        password: this.loginForm.value.password as NonNullable<string>
      };

      this.authService.requestToken(loginData).subscribe({
        next: this.handleSuccessfulResponse.bind(this),
        error: this.handleError.bind(this)
      });
    }
  }

  handleSuccessfulResponse(response: LoginResponse) {
    if (response?.access_token) {
      this.loginErrorResponse = '';
      console.log('Login successful', response);
      this.authService.setToken(response.access_token);
    }
  }

  handleError(error: any) {
    console.error('Login error', error);

    if (error?.error?.detail) {
      this.loginErrorResponse = error.error.detail;
    } else {
      this.loginErrorResponse = 'Unknown error occurred during login';
    }
  }

  errorEmailMessage() {
    if (this.loginForm.get('email')?.hasError('required')) {
      return 'Email is required';
    }
    if (this.loginForm.get('email')?.hasError('email')) {
      return 'Not a valid email';
    }
    return '';
  }

  errorPasswordMessage() {

    if (this.loginForm.get('password')?.hasError('required')) {
      return 'Password is required';
    }
    if (this.loginForm.get('password')?.hasError('minlength')) {
      return 'Password must be at least 6 characters';
    }

    return '';
  }

  errorLoginMessage() {
    if (this.loginErrorResponse != '') {
      return this.loginErrorResponse;
    }
    return '';
  }

}

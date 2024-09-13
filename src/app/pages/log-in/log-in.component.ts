import {Component, signal} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule, MatError} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {HttpService} from '../../shared/services/http.service';

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

  constructor(private httpService: HttpService) {
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }


  onSubmit(event: Event) {
    event.preventDefault();

    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
      console.log(loginData);

      const formData = new FormData();
      formData.append('username', loginData.email ?? '');
      formData.append('password', loginData.password ?? '');

      console.log('Sending login request as FormData', formData);

      this.httpService.postFormData('token', formData).subscribe(
        response => {
          // Handle the server response
          console.log('Login successful', response);
        },
        error => {
          // Handle the error
          console.error('Login failed', error);
        }
      );
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

}

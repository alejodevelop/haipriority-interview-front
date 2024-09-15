import {Component} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule, MatError} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {LoginData} from "../../shared/dto/loginData";
import {LoginResponse} from "../../shared/dto/loginResponse";
import {AuthService} from "../../auth/auth.service";
import {BannerComponent} from "../../shared/components/banner/banner.component";
import {AuthFormComponent} from "../../shared/components/auth-form/auth-form.component";
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatError,
    MatIcon,
    MatIconButton,
    MatButton,
    NgOptimizedImage,
    BannerComponent,
    AuthFormComponent,
    RouterLink
  ],
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent {

  errorResponseAfterRequest: string = '';

  constructor(private authService: AuthService, private router: Router) {
  }

  handleFormSubmit(formData: FormGroup) {
    if (formData) {
      const loginData: LoginData = {
        username: formData.get('email')?.value,
        password: formData.get('password')?.value,
      };

      this.authService.requestToken(loginData).subscribe({
        next: this.handleSuccessfulResponse.bind(this),
        error: this.handleError.bind(this)
      });
    }
  }

  handleSuccessfulResponse(response: LoginResponse) {
    if (response?.access_token) {
      this.errorResponseAfterRequest = '';
      this.authService.setToken(response.access_token);
      this.router.navigate(['/home']);
    }
  }

  handleError(error: any) {
    if (error?.error?.detail) {
      this.errorResponseAfterRequest = error.error.detail;
    } else {
      this.errorResponseAfterRequest = 'Unknown error occurred during login';
    }
  }

}

import {Component, EventEmitter, Input, Output, signal} from '@angular/core';
import {BannerComponent} from "../banner/banner.component";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatError, MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [
    BannerComponent,
    FormsModule,
    MatButton,
    MatError,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatSuffix,
    ReactiveFormsModule
  ],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.css'
})
export class AuthFormComponent {
  hide = signal(true);
  @Input() formTitle: string = 'Bienvenido 👋';
  @Input() errorResponseAfterRequest: string = '';
  @Output() submitForm = new EventEmitter<FormGroup>();

  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }


  onSubmit(event: Event) {
    event.preventDefault();
    if (this.loginForm.valid) {
      this.submitForm.emit(this.loginForm);
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
    if (this.errorResponseAfterRequest != '') {
      return this.errorResponseAfterRequest;
    }
    return '';
  }
}

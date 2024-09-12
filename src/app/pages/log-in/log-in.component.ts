import {Component, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatError} from '@angular/material/form-field';
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";

@Component({
    selector: 'app-log-in',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatError, MatIcon, MatIconButton, MatButton],
    templateUrl: './log-in.component.html',
    styleUrls: ['./log-in.component.css']
})
export class LogInComponent {
    hide = signal(true);

    clickEvent(event: MouseEvent) {
        this.hide.set(!this.hide());
        event.stopPropagation();
    }

    loginForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });

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

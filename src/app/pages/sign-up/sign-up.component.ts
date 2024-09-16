import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {AuthFormComponent} from "../../shared/components/auth-form/auth-form.component";
import {BannerComponent} from "../../shared/components/banner/banner.component";
import {SweetAlert2Module} from '@sweetalert2/ngx-sweetalert2';
import {UserResponse} from "../../dto/userResponse";
import {SignUpService} from "./sign-up.service";
import Swal from "sweetalert2";
import {Router} from "@angular/router";

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AuthFormComponent, BannerComponent, SweetAlert2Module],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  formTitle: string = 'Regístrate 🙃';
  errorResponseAfterRequest: string = '';

  constructor(private signUpService: SignUpService, private router: Router) {
  }

  handleFormSubmit(formData: FormGroup) {
    if (formData) {
      this.signUpService.createUser(formData.value).subscribe({
        next: this.handleSuccessfulResponse.bind(this),
        error: this.handleError.bind(this)
      });
    }
  }

  handleSuccessfulResponse(response: UserResponse) {
    if (response?.id && response?.email) {
      this.errorResponseAfterRequest = '';

      Swal.fire({
        title: "🎉 Genial 🎉",
        text: "Gracias por unirte a nuestro banco",
        width: 600,
        padding: "3em",
        color: "white",
        background: "#fff url(https://media.istockphoto.com/id/1248542684/vector/abstract-blurred-colorful-background.jpg?s=612x612&w=0&k=20&c=6aJX8oyUBsSBZFQUCJDP7KZ1y4vrf-wEH_SJsuq7B5I=)",
        backdrop: `
        rgba(0,0,123,0.4)
        url("https://sweetalert2.github.io/images/nyan-cat.gif")
        left top
        no-repeat
        `
      }).then(r => {
        this.router.navigate(['/login'], {queryParams: {email: response.email}});
      });

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

import {Injectable} from '@angular/core';
import {catchError, Observable, throwError} from 'rxjs';
import {LoginData} from "../pages/log-in/dto/loginData";
import {HttpService} from "../shared/services/http.service";
import {LoginResponse} from "../pages/log-in/dto/loginResponse";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string | null = null;

  constructor(private httpService: HttpService) {
  }

  requestToken(loginData: LoginData): Observable<LoginResponse> {
    const formData = new FormData();
    formData.append('username', loginData.username ?? '');
    formData.append('password', loginData.password ?? '');

    return this.httpService.postFormData<LoginResponse>('token', formData).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('access_token');
    }
    return this.token;
  }

  setToken(token: string): string | null {
    this.token = token;
    if (!this.token) {
      this.token = localStorage.getItem('access_token');
    }
    return this.token;
  }

  clearToken(): void {
    this.token = null;
    localStorage.removeItem('access_token');
  }
}

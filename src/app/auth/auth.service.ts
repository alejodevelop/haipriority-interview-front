import {Injectable} from '@angular/core';
import {catchError, Observable, throwError} from 'rxjs';
import {LoginData} from "../dto/loginData";
import {HttpService} from "../shared/services/http.service";
import {LoginResponse} from "../dto/loginResponse";
import {jwtDecode} from 'jwt-decode';


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
    if (this.token && this.isTokenExpired(this.token)) {
      this.clearToken();
      return null;
    }
    return this.token;
  }

  setToken(token: string): string | null {
    this.token = token;
    localStorage.setItem('access_token', token);
    if (!this.token) {
      this.token = localStorage.getItem('access_token');
      console.log('Token:', this.token);
    }
    return this.token;
  }

  clearToken(): void {
    this.token = null;
    localStorage.removeItem('access_token');
  }

  private isTokenExpired(token: string): boolean {
    const decoded: any = jwtDecode(token);
    if (decoded.exp) {
      const expirationDate = new Date(0);
      expirationDate.setUTCSeconds(decoded.exp);
      return expirationDate < new Date();
    }
    return false;
  }
}

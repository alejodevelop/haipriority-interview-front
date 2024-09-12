import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string | null = null;

  constructor(private http: HttpClient) {
  }

  requestToken(): Observable<{ token: string }> {
    return this.http.post<{ token: string }>('https://api.example.com/token', {});
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('authToken');
    }
    return this.token;
  }

  setToken(token: string): string | null {
    this.token = token;
    if (!this.token) {
      this.token = localStorage.getItem('authToken');
    }
    return this.token;
  }

  clearToken(): void {
    this.token = null;
    localStorage.removeItem('authToken');
  }
}

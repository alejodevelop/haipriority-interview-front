import {Injectable} from '@angular/core';
import {HttpService} from "../../shared/services/http.service";
import {catchError, Observable, throwError} from "rxjs";
import {UserResponse} from "../../shared/dto/userResponse";
import {LoginData} from "../../shared/dto/loginData";


@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  constructor(private httpService: HttpService) {
  }

  createUser(user: LoginData): Observable<UserResponse> {
    return this.httpService.post<UserResponse>('user', user).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

}

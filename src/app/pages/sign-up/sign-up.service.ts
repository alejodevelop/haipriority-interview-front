import {Injectable} from '@angular/core';
import {HttpService} from "../../shared/services/http.service";
import {catchError, Observable, throwError} from "rxjs";
import {UsuarioResponse} from "../../shared/dto/usuarioResponse";
import {LoginData} from "../../shared/dto/loginData";


@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  constructor(private httpService: HttpService) {
  }

  createUsuario(usuario: LoginData): Observable<UsuarioResponse> {
    return this.httpService.post<UsuarioResponse>('usuario', usuario).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

}

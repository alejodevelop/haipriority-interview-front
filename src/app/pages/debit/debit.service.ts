import {Injectable} from '@angular/core';
import {HttpService} from "../../shared/services/http.service";
import {DebitCardData} from "../../dto/debitCardData";
import {catchError, Observable, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DebitService {

  constructor(private httpService: HttpService) {
  }

  getDebitCards(): Observable<DebitCardData[]> {
    return this.httpService.get<DebitCardData[]>('debitcards').pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  createDebitCard(cardData: DebitCardData): Observable<DebitCardData> {
    return this.httpService.post<DebitCardData>('debitcard', cardData).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  editDebitCard(cardData: DebitCardData): Observable<DebitCardData> {
    return this.httpService.put<DebitCardData>('debitcard/' + cardData.card_number, cardData).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  deleteDebitCard(cardNumber: string): Observable<any> {
    return this.httpService.delete(`debitcard/${cardNumber}`).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

}

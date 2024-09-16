import {Injectable} from '@angular/core';
import {HttpService} from "../../shared/services/http.service";
import {CreditCardData} from "../../dto/creditCardData";
import {catchError, Observable, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CreditService {

  constructor(private httpService: HttpService) {
  }

  getCreditCards(): Observable<CreditCardData[]> {
    return this.httpService.get<CreditCardData[]>('creditcards').pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  createCreditCard(cardData: CreditCardData): Observable<CreditCardData> {
    return this.httpService.post<CreditCardData>('creditcard', cardData).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  editCreditCard(cardData: CreditCardData): Observable<CreditCardData> {
    return this.httpService.put<CreditCardData>('creditcard/' + cardData.card_number, cardData).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  deleteCreditCard(cardNumber: string): Observable<any> {
    return this.httpService.delete(`creditcard/${cardNumber}`).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }
}

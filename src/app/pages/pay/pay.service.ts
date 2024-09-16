import {Injectable} from '@angular/core';
import {HttpService} from "../../shared/services/http.service";
import {Observable, catchError, throwError} from "rxjs";
import {DebitCardData} from "../../dto/debitCardData";
import {CreditCardData} from "../../dto/creditCardData";

@Injectable({
  providedIn: 'root'
})
export class PayService {

  constructor(private httpService: HttpService) {
  }

  payWithCreditCard(cardNumber: string, amount: number): Observable<CreditCardData> {
    return this.httpService.put<CreditCardData>(`creditcard/pay/${cardNumber}/${amount}`, {}).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  payOffCreditCard(cardNumber: string, amount: number): Observable<CreditCardData> {
    return this.httpService.put<CreditCardData>(`creditcard/payoff/${cardNumber}/${amount}`, {}).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  depositToDebitCard(cardNumber: string, amount: number): Observable<DebitCardData> {
    return this.httpService.put<DebitCardData>(`debitcard/deposit/${cardNumber}/${amount}`, {}).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  payWithDebitCard(cardNumber: string, amount: number): Observable<DebitCardData> {
    return this.httpService.put<DebitCardData>(`debitcard/pay/${cardNumber}/${amount}`, {}).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }
}

import {Injectable} from '@angular/core';
import {HttpService} from "../../shared/services/http.service";
import {LoanData} from "../../dto/loanData";
import {catchError, Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  constructor(private httpService: HttpService) {
  }

  getLoans(): Observable<LoanData[]> {
    return this.httpService.get<LoanData[]>('loans').pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  createLoan(loan: Partial<LoanData>): Observable<LoanData> {
    return this.httpService.post<LoanData>('loan', loan).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  payoffLoan(loanId: number, amount: number): Observable<LoanData> {
    return this.httpService.put<LoanData>(`loan/payoff/${loanId}/${amount}`, {}).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  deleteLoan(loanId: number): Observable<void> {
    return this.httpService.delete<void>(`loan/${loanId}`).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

}

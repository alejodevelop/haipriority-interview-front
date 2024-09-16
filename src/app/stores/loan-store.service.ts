import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {LoanData} from '../dto/loanData';

@Injectable({
  providedIn: 'root'
})
export class LoanStoreService {
  private loanListSubject = new BehaviorSubject<LoanData[]>([]);
  loanList$ = this.loanListSubject.asObservable();

  setLoanList(loanList: LoanData[]) {
    this.loanListSubject.next(loanList);
  }

  getLoanList(): LoanData[] {
    return this.loanListSubject.getValue();
  }
}

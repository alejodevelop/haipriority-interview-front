// credit-card-store.service.ts
import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {CreditCardData} from '../dto/creditCardData';

@Injectable({
  providedIn: 'root'
})
export class CreditCardStoreService {
  private cardListSubject = new BehaviorSubject<CreditCardData[]>([]);
  cardList$ = this.cardListSubject.asObservable();

  setCardList(cardList: CreditCardData[]) {
    this.cardListSubject.next(cardList);
  }

  getCardList(): CreditCardData[] {
    return this.cardListSubject.getValue();
  }
}

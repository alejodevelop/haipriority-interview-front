// debit-card-store.service.ts
import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {DebitCardData} from '../dto/debitCardData';

@Injectable({
  providedIn: 'root'
})
export class DebitCardStoreService {
  private cardListSubject = new BehaviorSubject<DebitCardData[]>([]);
  cardList$ = this.cardListSubject.asObservable();

  setCardList(cardList: DebitCardData[]) {
    this.cardListSubject.next(cardList);
  }

  getCardList(): DebitCardData[] {
    return this.cardListSubject.getValue();
  }
}

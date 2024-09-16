import {Component, OnInit} from '@angular/core';
import Swal from "sweetalert2";
import {CreditCardData} from "../../dto/creditCardData";
import {DebitCardData} from "../../dto/debitCardData";
import {CreditCardStoreService} from "../../stores/credit-card-store.service";
import {DebitCardStoreService} from "../../stores/debit-card-store.service";
import {CardComponent} from "../../shared/components/card/card.component";
import {MatError} from "@angular/material/form-field";
import {MatButton} from "@angular/material/button";
import {ExpirationDatePipe} from "../../shared/pipes/expiration-date.pipe";
import {lastValueFrom} from "rxjs";
import {CreditService} from "../credit/credit.service";
import {DebitService} from "../debit/debit.service";
import {PayService} from "./pay.service";

@Component({
  selector: 'app-pay',
  standalone: true,
  imports: [
    CardComponent,
    MatError,
    MatButton,
    ExpirationDatePipe
  ],
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css']
})
export class PayComponent implements OnInit {

  creditCardList: CreditCardData[] = [];
  debitCardList: DebitCardData[] = [];
  errorResponseAfterRequest = '';

  constructor(
    private creditCardStore: CreditCardStoreService,
    private debitCardStore: DebitCardStoreService,
    private creditService: CreditService,
    private debitService: DebitService,
    private payService: PayService
  ) {

  }

  ngOnInit() {
    this.creditService.getCreditCards().subscribe({
      next: (creditCards: CreditCardData[]) => {
        this.creditCardStore.setCardList(creditCards);
      },
      error: (error) => {
        this.handleError(error);
      }
    });

    this.debitService.getDebitCards().subscribe({
      next: (debitCards: DebitCardData[]) => {
        this.debitCardStore.setCardList(debitCards);
      },
      error: (error) => {
        this.handleError(error);
      }
    });

    this.creditCardStore.cardList$.subscribe(cardList => {
      this.creditCardList = cardList;
    });
    this.debitCardStore.cardList$.subscribe(cardList => {
      this.debitCardList = cardList;
    });
  }


  async payWithCreditCard(cardNumber: string, amount: number) {
    try {
      await lastValueFrom(this.payService.payWithCreditCard(cardNumber, amount));
      this.errorResponseAfterRequest = '';
      this.creditCardList = this.creditCardList.map(card => {
        if (card.card_number === cardNumber) {
          card.balance += amount;
        }
        return card
      });
      await Swal.fire('¡Genial! 😎', 'Pago realizado con éxito!', 'success');
    } catch (error) {
      this.handleError(error);
    }
  }

  async payCreditCardDebt(cardNumber: string, amount: number) {
    try {
      await lastValueFrom(this.payService.payOffCreditCard(cardNumber, amount));
      this.errorResponseAfterRequest = '';
      this.creditCardList = this.creditCardList.map(card => {
        if (card.card_number === cardNumber) {
          card.balance -= amount;
        }
        return card
      });
      await Swal.fire('¡Genial! 😎', 'Deuda pagada con éxito!', 'success');
    } catch (error) {
      this.handleError(error);
    }
  }

  async payWithDebitCard(cardNumber: string, amount: number) {
    try {
      await lastValueFrom(this.payService.payWithDebitCard(cardNumber, amount));
      this.errorResponseAfterRequest = '';
      this.debitCardList = this.debitCardList.map(card => {
        if (card.card_number === cardNumber) {
          card.balance -= amount;
        }
        return card
      });
      await Swal.fire('¡Genial! 😎', 'Pago realizado con éxito!', 'success');
    } catch (error) {
      this.handleError(error);
    }
  }

  async depositToDebitCard(cardNumber: string, amount: number) {
    try {
      await lastValueFrom(this.payService.depositToDebitCard(cardNumber, amount));
      this.errorResponseAfterRequest = '';
      this.debitCardList = this.debitCardList.map(card => {
        if (card.card_number === cardNumber) {
          card.balance += amount;
        }
        return card
      });
      await Swal.fire('¡Genial! 😎', 'Depósito realizado con éxito!', 'success');
    } catch (error) {
      this.handleError(error);
    }
  }

  handleError(error: any) {
    if (error?.error?.detail) {
      this.errorResponseAfterRequest = error.error.detail;
      Swal.fire('¡Error! 😢', this.errorResponseAfterRequest, 'error');
    } else {
      this.errorResponseAfterRequest = 'Ocurrió un error desconocido';
      Swal.fire('¡Error! 😢', this.errorResponseAfterRequest, 'error');
    }
  }
}

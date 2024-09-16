import {Component, OnInit} from '@angular/core';
import {CardComponent} from "../../shared/components/card/card.component";
import {MatIcon} from "@angular/material/icon";
import {MatButton} from "@angular/material/button";
import {DebitCardData} from "../../dto/debitCardData";
import {DebitService} from "./debit.service";
import Swal from "sweetalert2";
import {MatError} from "@angular/material/form-field";
import {ExpirationDatePipe} from "../../shared/pipes/expiration-date.pipe";
import {lastValueFrom} from "rxjs";
import {DebitCardStoreService} from "../../stores/debit-card-store.service";

@Component({
  selector: 'app-debit',
  standalone: true,
  imports: [
    CardComponent,
    MatIcon,
    MatButton,
    MatError,
    ExpirationDatePipe
  ],
  templateUrl: './debit.component.html',
  styleUrl: './debit.component.css'
})
export class DebitComponent implements OnInit {

  cardList: DebitCardData[] = [];
  errorResponseAfterRequest: string = '';

  constructor(private debitService: DebitService, private debitCardStore: DebitCardStoreService) {
  }

  ngOnInit() {

    this.debitService.getDebitCards().subscribe({
      next: this.handleSuccessfulResponse.bind(this),
      error: this.handleError.bind(this)
    });

    this.debitCardStore.cardList$.subscribe(cardList => {
      this.cardList = cardList;
    });

  }

  onCreateCard() {

    Swal.fire({
      title: "Ingresa nombre y saldo",
      html: `
    <input id="cardName" class="swal2-input" placeholder="Nombre Tarjeta">
    <input id="balance" type="number" class="swal2-input" placeholder="Balance" step="0.1">
  `,
      inputAttributes: {
        autocapitalize: "off",
        autocomplete: "off",
        autocorrect: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Continuar",
      confirmButtonColor: "#005cbb",
      cancelButtonText: "Volver",
      cancelButtonColor: "red",
      showLoaderOnConfirm: true,
      preConfirm: async () => {

        const cardName = (Swal.getPopup()?.querySelector('#cardName') as HTMLInputElement)?.value ?? '';
        const balance = parseFloat((Swal.getPopup()?.querySelector('#balance') as HTMLInputElement)?.value ?? '0');

        if (!cardName || isNaN(balance)) {
          Swal.showValidationMessage('Los campos no pueden estar vacíos');
          return;
        }

        if (cardName.length < 3) {
          Swal.showValidationMessage('Pofavor ingresa un nombre con al menos 3 caracteres');
          return;
        }

        if (balance <= 0) {
          Swal.showValidationMessage('Pofavor ingresa un saldo válido');
          return;
        }

        try {
          const response = await lastValueFrom(this.debitService.createDebitCard({
            card_holder_name: cardName,
            balance: balance
          } as DebitCardData));

          this.cardList.push(response);
          this.debitCardStore.setCardList(this.cardList);
          this.errorResponseAfterRequest = '';

          await Swal.fire({
            title: '¡Genial! 😎',
            text: 'Tarjeta creada con éxito!',
            icon: 'success',
            confirmButtonColor: '#005cbb'
          });
        } catch (error) {
          this.handleError(error);
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    });

  }

  onEditCard(cardData: { cardNumber: string, name: string }) {
    Swal.fire({
      title: "Editar nombre ✏️",
      html: `
      <input id="cardName" class="swal2-input" placeholder="Nombre Tarjeta" value="${cardData.name}">
    `,
      inputAttributes: {
        autocapitalize: "off",
        autocomplete: "off",
        autocorrect: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Guardar",
      confirmButtonColor: "#005cbb",
      cancelButtonText: "Cancelar",
      cancelButtonColor: "red",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const cardName = (Swal.getPopup()?.querySelector('#cardName') as HTMLInputElement)?.value ?? '';

        if (!cardName) {
          Swal.showValidationMessage('El campo no puede estar vacío');
          return;
        }

        if (cardName.length < 3) {
          Swal.showValidationMessage('Por favor ingresa un nombre con al menos 3 caracteres');
          return;
        }

        try {
          const response = await lastValueFrom(this.debitService.editDebitCard({
            card_holder_name: cardName,
            card_number: cardData.cardNumber
          } as DebitCardData));

          this.cardList = this.cardList.map(card => {
            if (card.card_number === cardData.cardNumber) {
              card.card_holder_name = cardName;
            }
            return card;
          });
          this.debitCardStore.setCardList(this.cardList);
          this.errorResponseAfterRequest = '';

          await Swal.fire({
            title: '¡Genial! 😎',
            text: 'Tarjeta editada con éxito!',
            icon: 'success',
            confirmButtonColor: '#005cbb'
          });
        } catch (error) {
          this.handleError(error);
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    });
  }

  onDeleteCard(cardNumber: string) {
    Swal.fire({
      title: "¿Seguro?",
      text: "¡No se puede revertir!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#005cbb",
      cancelButtonColor: "red",
      cancelButtonText: "No",
      confirmButtonText: "Si"
    }).then((result) => {
      if (result.isConfirmed) {

        this.debitService.deleteDebitCard(cardNumber).subscribe({
          next: () => {
            this.cardList = this.cardList.filter(card => card.card_number !== cardNumber);
            this.debitCardStore.setCardList(this.cardList);
          },
          error: this.handleError.bind(this)
        });

        Swal.fire({
          title: "Eliminado!",
          text: "La tarjeta ha sido eliminada.",
          icon: "success",
          confirmButtonColor: "#005cbb"
        });
      }
    });
  }

  handleSuccessfulResponse(response: DebitCardData[]) {
    if (response) {
      this.errorResponseAfterRequest = '';
      this.cardList = response;
      this.debitCardStore.setCardList(response);
    }
  }

  handleError(error: any) {
    if (error?.error?.detail) {
      this.errorResponseAfterRequest = error.error.detail;
    } else {
      this.errorResponseAfterRequest = 'Unknown error occurred during login';
    }
  }

  errorResponse() {
    if (this.errorResponseAfterRequest != '') {
      return this.errorResponseAfterRequest + " 😔";
    }
    return '';
  }

}

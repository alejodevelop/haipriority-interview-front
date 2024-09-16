import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CardComponent} from "../../shared/components/card/card.component";
import {CreditService} from "./credit.service";
import {lastValueFrom} from 'rxjs';
import Swal from 'sweetalert2';
import {CreditCardData} from '../../dto/creditCardData';
import {ExpirationDatePipe} from "../../shared/pipes/expiration-date.pipe";
import {MatButton} from "@angular/material/button";
import {MatError} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {CreditCardStoreService} from "../../stores/credit-card-store.service";

@Component({
  selector: 'app-credit',
  standalone: true,
  imports: [CommonModule, CardComponent, ExpirationDatePipe, MatButton, MatError, MatIcon],
  templateUrl: './credit.component.html',
  styleUrls: ['./credit.component.css']
})
export class CreditComponent implements OnInit {
  cardList: CreditCardData[] = [];
  errorResponseAfterRequest = '';

  constructor(private creditService: CreditService, private creditCardStore: CreditCardStoreService) {

  }

  ngOnInit() {

    this.creditService.getCreditCards().subscribe({
      next: this.handleSuccessfulResponse.bind(this),
      error: this.handleError.bind(this)
    });

  }

  onCreateCard() {

    Swal.fire({
      title: "Ingresa un nombre",
      html: `
    <input id="cardName" class="swal2-input" placeholder="Nombre Tarjeta">
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

        if (!cardName) {
          Swal.showValidationMessage('Los campos no pueden estar vacíos');
          return;
        }

        if (cardName.length < 3) {
          Swal.showValidationMessage('Pofavor ingresa un nombre con al menos 3 caracteres');
          return;
        }

        try {
          const response = await lastValueFrom(this.creditService.createCreditCard({
            card_holder_name: cardName,
          } as CreditCardData));

          this.cardList.push(response);
          this.creditCardStore.setCardList(this.cardList);
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
          await lastValueFrom(this.creditService.editCreditCard({
            card_number: cardData.cardNumber,
            card_holder_name: cardName,
          } as CreditCardData));

          this.cardList = this.cardList.map(card => {
            if (card.card_number === cardData.cardNumber) {
              card.card_holder_name = cardName;
            }
            return card;
          });
          this.creditCardStore.setCardList(this.cardList);
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

        this.creditService.deleteCreditCard(cardNumber).subscribe({
          next: () => {
            this.cardList = this.cardList.filter(card => card.card_number !== cardNumber);
            this.creditCardStore.setCardList(this.cardList);
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

  handleSuccessfulResponse(response: CreditCardData[]) {
    if (response) {
      this.errorResponseAfterRequest = '';
      this.cardList = response;
      this.creditCardStore.setCardList(response);
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

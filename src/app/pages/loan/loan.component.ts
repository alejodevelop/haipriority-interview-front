import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoanService} from './loan.service';
import {LoanStoreService} from '../../stores/loan-store.service';
import {lastValueFrom} from 'rxjs';
import Swal from 'sweetalert2';
import {LoanData} from '../../dto/loanData';
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-loan',
  standalone: true,
  imports: [CommonModule, MatButton, MatIcon],
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.css']
})
export class LoanComponent implements OnInit {
  loanList: LoanData[] = [];
  errorResponseAfterRequest: string = '';

  constructor(
    private loanService: LoanService,
    private loanStore: LoanStoreService
  ) {
  }

  ngOnInit() {
    this.loanService.getLoans().subscribe({
      next: (loans: LoanData[]) => {
        this.loanStore.setLoanList(loans);
      },
      error: (error) => {
        this.handleError(error);
      }
    });

    this.loanStore.loanList$.subscribe(loanList => {
      this.loanList = loanList;
    });
  }

  async createLoan() {
    Swal.fire({
      title: "Crear Préstamo",
      html: `
      <input id="amount" type="number" class="swal2-input" placeholder="Monto">
    `,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      confirmButtonColor: "#005cbb",
      cancelButtonText: "Cancelar",
      cancelButtonColor: "red",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const amount = parseFloat((Swal.getPopup()?.querySelector('#amount') as HTMLInputElement)?.value ?? '0');

        if (isNaN(amount) || amount <= 0) {
          Swal.showValidationMessage('El monto es obligatorio y debe ser mayor que cero');
          return;
        }

        try {
          const response = await lastValueFrom(this.loanService.createLoan({
            amount,
            balance: amount,
            creation_date: new Date().toISOString()
          } as LoanData));

          this.loanList.push(response);
          this.loanStore.setLoanList(this.loanList);
          this.errorResponseAfterRequest = '';

          await Swal.fire({
            title: '¡Genial! 😎',
            text: 'Préstamo creado con éxito!',
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

  async payoffLoan(loanId: number) {
    const {value: amount} = await Swal.fire({
      title: 'Pagar Deuda',
      input: 'number',
      inputLabel: 'Monto a pagar',
      inputPlaceholder: 'Ingrese el monto a pagar',
      showCancelButton: true,
      confirmButtonText: 'Pagar',
      confirmButtonColor: '#005cbb',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: 'red',
      inputValidator: (value) => {
        const amount = parseFloat(value);
        if (!value || isNaN(amount) || amount <= 0) {
          return 'El monto es obligatorio y debe ser mayor que cero';
        }
        return null;
      }
    });

    if (amount) {
      try {
        await lastValueFrom(this.loanService.payoffLoan(loanId, parseFloat(amount)));
        this.loanList = this.loanList.map(loan => {
          if (loan.id === loanId) {
            loan.balance -= parseFloat(amount);
          }
          return loan;
        });
        this.loanStore.setLoanList(this.loanList);
        this.errorResponseAfterRequest = '';

        await Swal.fire({
          title: '¡Genial! 😎',
          text: 'Abono exitoso!',
          icon: 'success',
          confirmButtonColor: '#005cbb'
        });
      } catch (error) {
        this.handleError(error);
      }
    }
  }

  async deleteLoan(loanId: number) {
    try {
      await lastValueFrom(this.loanService.deleteLoan(loanId));
      this.loanList = this.loanList.filter(loan => loan.id !== loanId);
      this.loanStore.setLoanList(this.loanList);
      this.errorResponseAfterRequest = '';

      await Swal.fire({
        title: 'Eliminado!',
        text: 'El préstamo ha sido eliminado.',
        icon: 'success',
        confirmButtonColor: '#005cbb'
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  handleError(error: any) {
    if (error?.error?.detail) {
      this.errorResponseAfterRequest = error.error.detail;
    } else {
      this.errorResponseAfterRequest = 'An error occurred';
    }
  }

}

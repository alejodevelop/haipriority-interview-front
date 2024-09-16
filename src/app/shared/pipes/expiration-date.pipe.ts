import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  standalone: true,
  name: 'expirationDate'
})
export class ExpirationDatePipe implements PipeTransform {
  transform(value: string): string {
    const date = new Date(value);
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Añadir cero si es necesario
    const year = date.getFullYear();
    return `${month}/${year}`;
  }
}

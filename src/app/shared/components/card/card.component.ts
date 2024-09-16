import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  isFlipped = false;

  @Input() cardNumber = '1234 5678 9876 5432';
  @Input() cardHolder: string = 'John Doe';
  @Input() expirationDate = '12/24';
  @Input() cvv = '123';
  @Output() deleteCard = new EventEmitter<string>();
  @Output() editCard = new EventEmitter<{ cardNumber: string, name: string }>();

  flipCard() {
    this.isFlipped = !this.isFlipped;
  }

  edit(event: Event) {
    event.stopPropagation();
    this.editCard.emit({cardNumber: this.cardNumber, name: this.cardHolder});
  }

  delete(event: Event) {
    event.stopPropagation();
    this.deleteCard.emit(this.cardNumber);
  }
}

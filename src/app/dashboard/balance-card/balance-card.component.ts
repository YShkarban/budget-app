import { Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { SavingswithdrawDialogComponent } from '../savingswithdraw-dialog/savingswithdraw-dialog.component';

@Component({
  selector: 'app-balance-card',
  standalone: true,
  imports: [
    MatCard,
    MatButtonModule,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCardActions,
  ],
  templateUrl: './balance-card.component.html',
  styleUrl: './balance-card.component.scss',
})
export class BalanceCardComponent {
  private dialog = inject(MatDialog);

  @Input() title!: string;
  @Input() amount!: number;
  @Input() color: string = 'black';

  doSavingsWithdraw() {
    const dialogRef = this.dialog.open(SavingswithdrawDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

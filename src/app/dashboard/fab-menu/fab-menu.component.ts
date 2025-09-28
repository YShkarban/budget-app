import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PaymentDialogComponent } from '../payment-dialog/payment-dialog.component';
import { SavingsDialogComponent } from '../savings-dialog/savings-dialog.component';
import { BudgetDialogComponent } from '../budget-dialog/budget-dialog.component';

@Component({
  selector: 'app-fab-menu',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatMenuModule, MatDialogModule],
  templateUrl: './fab-menu.component.html',
  styleUrl: './fab-menu.component.scss',
})
export class FabMenuComponent {
  private dialog = inject(MatDialog);

  fabMenuOpen = false;

  onFabClick(action: number) {
    this.fabMenuOpen = false;

    if (action === 1) {
      const dialogRef = this.dialog.open(BudgetDialogComponent);
      dialogRef.afterClosed().subscribe((result) => {
        console.log(`Dialog result: ${result}`);
      });
    } else if (action === 2) {
      const dialogRef = this.dialog.open(PaymentDialogComponent);
      dialogRef.afterClosed().subscribe((result) => {
        console.log(`Dialog result: ${result}`);
      });
    } else if (action === 3) {
      const dialogRef = this.dialog.open(SavingsDialogComponent);
      dialogRef.afterClosed().subscribe((result) => {
        console.log(`Dialog result: ${result}`);
      });
    }
  }
}

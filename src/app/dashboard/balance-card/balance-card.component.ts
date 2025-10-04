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
import { TransactionHistory } from '../../../interfaces/history';
import { MatTableModule } from '@angular/material/table';
import { FinanceService } from '../../../services/finance.service';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { DisplayColumns } from '../../../interfaces/display-columns';
import { A11yModule } from "@angular/cdk/a11y";

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
    MatTableModule,
    MatIconModule,
    DatePipe,
    A11yModule
],
  templateUrl: './balance-card.component.html',
  styleUrl: './balance-card.component.scss',
})
export class BalanceCardComponent {
  private dialog = inject(MatDialog);
  financeService = inject(FinanceService);

  @Input() title!: string;
  @Input() amount!: number;
  @Input() color: string = 'black';
  @Input() expanded: boolean = false;
  @Input() dataSource: any[] = [];

  displayedColumns: DisplayColumns[] = [];
  displayColumnsShow: string[] = [];

  ngOnInit() {
    this.displayedColumns = [
      { name: 'amount', show: true },
      { name: 'description', show: true },
      { name: 'type', show: this.title === 'Payments' },
      { name: 'date', show: true },
    ];

    this.displayColumnsShow = this.displayedColumns
      .filter((col) => col.show)
      .map((col) => col.name);
  }

  doSavingsWithdraw() {
    const dialogRef = this.dialog.open(SavingswithdrawDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  toggleHistory() {
    this.expanded = !this.expanded;
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FabMenuComponent } from './fab-menu/fab-menu.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BalanceCardComponent } from './balance-card/balance-card.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { filter, map, Observable, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { computed } from '@angular/core';
import { AddCategoryDialogComponent } from './add-category-dialog/add-category-dialog.component';
import { Savings } from '../../interfaces/savings';
import { AuthService } from '../../services/auth.service';
import { FinanceService } from '../../services/finance.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    FabMenuComponent,
    MatButtonModule,
    MatToolbarModule,
    BalanceCardComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private dialog = inject(MatDialog);
  financeService = inject(FinanceService);

  fabMenuOpen = false;

  now = new Date();
  firstDay = new Date(this.now.getFullYear(), this.now.getMonth(), 1);
  lastDay = new Date(this.now.getFullYear(), this.now.getMonth() + 1, 0);

  ngOnInit(): void {}

  addCategory() {
    const dialogRef = this.dialog.open(AddCategoryDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

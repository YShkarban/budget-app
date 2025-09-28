import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FabMenuComponent } from './fab-menu/fab-menu.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BalanceCardComponent } from './balance-card/balance-card.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  AngularFirestore,
} from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { computed } from '@angular/core';




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
  private snackbar = inject(MatSnackBar);
  private db = inject(AngularFirestore);

  fabMenuOpen = false;

  now = new Date();
  firstDay = new Date(this.now.getFullYear(), this.now.getMonth(), 1);
  lastDay = new Date(this.now.getFullYear(), this.now.getMonth() + 1, 0);

  paymentArray$ = this.db
    .collection('transactions')
    .valueChanges({ idField: 'id' })
    .pipe(
      map((items: any[]) => items.flatMap((item) => item.payment ?? []))
    ) as Observable<any[]>;

  budgetArray$ = this.db
    .collection('transactions')
    .valueChanges({ idField: 'id' })
    .pipe(
      map((items: any[]) => items.flatMap((item) => item.budget ?? []))
    ) as Observable<any[]>;

  savingsArray$ = this.db
    .collection('transactions')
    .valueChanges({ idField: 'id' })
    .pipe(
      map((items: any[]) => items.flatMap((item) => item.savings ?? []))
    ) as Observable<any[]>;

  paymentArray = toSignal(this.paymentArray$, { initialValue: [] });
  budgetArray = toSignal(this.budgetArray$, { initialValue: [] });
  savingsArray = toSignal(this.savingsArray$, { initialValue: [] });

  paymentSum = computed(() =>
    this.paymentArray().reduce((acc, item) => acc + (item.amount ?? 0), 0)
  );

  budgetSum = computed(() =>
    this.budgetArray().reduce((acc, item) => acc + (item.amount ?? 0), 0)
  );

  savingsSum = computed(() =>
    this.savingsArray().reduce((acc, item) => acc + (item.amount ?? 0), 0)
  );

  ngOnInit(): void {}

}

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
  private authService = inject(AuthService);

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

  savings$ = this.authService.userId$.pipe(
    filter((uid): uid is string => !!uid), // only continue if logged in
    switchMap((uid) => this.db.collection('savings').doc(uid).valueChanges()),
    map((doc: any) => doc?.array ?? [])
  ) as Observable<Savings[]>;

  savingsSignal = toSignal(this.savings$, { initialValue: [] });

  savingsTotal = computed(() =>
    this.savingsSignal().reduce((acc, item) => acc + (item.amount ?? 0), 0)
  );

  ngOnInit(): void {}

  addCategory() {
    const dialogRef = this.dialog.open(AddCategoryDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

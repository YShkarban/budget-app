import { computed, inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';
import { filter, map, Observable, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { Savings } from '../interfaces/savings';

@Injectable({
  providedIn: 'root',
})
export class FinanceService {
  private db = inject(AngularFirestore);
  private authService = inject(AuthService);

  constructor() {}

  // --- raw firestore streams ---
  paymentArray$ = this.db
    .collection('transactions')
    .valueChanges({ idField: 'id' })
    .pipe(map((items: any[]) => items.flatMap((item) => item.payment ?? [])));

  budgetArray$ = this.db
    .collection('transactions')
    .valueChanges({ idField: 'id' })
    .pipe(map((items: any[]) => items.flatMap((item) => item.budget ?? [])));

  savingsArray$ = this.db
    .collection('transactions')
    .valueChanges({ idField: 'id' })
    .pipe(map((items: any[]) => items.flatMap((item) => item.savings ?? [])));

  // --- signals ---
  paymentArray = toSignal(this.paymentArray$, { initialValue: [] });
  budgetArray = toSignal(this.budgetArray$, { initialValue: [] });
  savingsArray = toSignal(this.savingsArray$, { initialValue: [] });

  // --- computed sums ---
  paymentSum = computed(() =>
    this.paymentArray().reduce((acc, item) => acc + (item.amount ?? 0), 0)
  );

  budgetSum = computed(() =>
    this.budgetArray().reduce((acc, item) => acc + (item.amount ?? 0), 0)
  );

  savingsSum = computed(() =>
    this.savingsArray().reduce((acc, item) => acc + (item.amount ?? 0), 0)
  );

  // --- user savings (separate collection) ---
  savings$ = this.authService.userId$.pipe(
    filter((uid): uid is string => !!uid),
    switchMap((uid) => this.db.collection('savings').doc(uid).valueChanges()),
    map((doc: any) => doc?.array ?? [])
  ) as Observable<Savings[]>;

  savingsSignal = toSignal(this.savings$, { initialValue: [] });

  savingsTotal = computed(() =>
    this.savingsSignal().reduce((acc, item) => acc + (item.amount ?? 0), 0)
  );
}

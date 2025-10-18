import { computed, inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';
import { BehaviorSubject, combineLatest, filter, map, Observable, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { Savings } from '../interfaces/savings';
import { PaymentType } from '../interfaces/payment-type';
import { format } from 'date-fns';
import { HistoryByType } from '../interfaces/history-data';

@Injectable({
  providedIn: 'root',
})
export class FinanceService {
  private db = inject(AngularFirestore);
  private authService = inject(AuthService);

  constructor() {}

  // Add yearMonth stream
  private yearMonth$ = new BehaviorSubject<string>(
    format(new Date(), 'yyyy-MM')
  );

  // --- raw firestore streams ---
  paymentArray$ = combineLatest([
    this.authService.userId$.pipe(filter((uid): uid is string => !!uid)),
    this.yearMonth$,
  ]).pipe(
    switchMap(([uid, yearMonth]) =>
      this.db
        .collection('transactions')
        .doc(`${uid}_${yearMonth}`)
        .valueChanges()
        .pipe(
          map((doc: any) => {
            // Ensure we always return an array
            const payments = doc?.payment || [];
            return Array.isArray(payments) ? payments : [];
          })
        )
    )
  ) as Observable<any[]>;

  budgetArray$ = combineLatest([
    this.authService.userId$.pipe(filter((uid): uid is string => !!uid)),
    this.yearMonth$,
  ]).pipe(
    switchMap(([uid, yearMonth]) =>
      this.db
        .collection('transactions')
        .doc(`${uid}_${yearMonth}`)
        .valueChanges()
        .pipe(
          map((doc: any) => {
            // Ensure we always return an array
            const budgets = doc?.budget || [];
            return Array.isArray(budgets) ? budgets : [];
          })
        )
    )
  ) as Observable<any[]>;

  // --- signals ---
  paymentArray = toSignal(this.paymentArray$, { initialValue: [] });
  budgetArray = toSignal(this.budgetArray$, { initialValue: [] });

  // --- computed sums ---
  paymentSum = computed(() =>
    this.paymentArray().reduce((acc, item) => acc + (item.amount ?? 0), 0)
  );

  budgetSum = computed(() =>
    this.budgetArray().reduce((acc, item) => acc + (item.amount ?? 0), 0)
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

  // payment types
  paymentType$ = this.db
    .collection('payment-type')
    .valueChanges({ idField: 'id' })
    .pipe(
      map((items: any[]) => {
        // If items[0].name is an array, flatten it
        if (items.length && Array.isArray(items[0].name)) {
          return items[0].name.map((name: string) => ({ name }));
        }
        return items;
      })
    ) as Observable<PaymentType[]>;

  paymentTypeArray = toSignal(this.paymentType$, {
    initialValue: [] as PaymentType[],
  });

  overviewBalance = computed(() => this.budgetSum() - this.paymentSum());

  groupedPayments = computed(() => {
    const payments = this.paymentArray();
    return payments.reduce((acc, item) => {
      const type = item.type || 'Other';
      if (!acc[type]) {
        acc[type] = 0;
      }
      acc[type] += item.amount || 0;
      return acc;
    }, {} as Record<string, number>);
  });

  groupedPaymentsArray = computed(() => {
    const grouped = this.groupedPayments();
    return Object.entries(grouped).map(([type, amount]) => ({
      type,
      amount,
    })) as HistoryByType[];
  });

  // Add method to change year-month
  setYearMonth(yearMonth: string) {
    this.yearMonth$.next(yearMonth);
  }

  // Get current year-month
  getCurrentYearMonth() {
    const yearMonth = format(new Date(), 'yyyy-MM');    
    return this.yearMonth$.getValue() ?? yearMonth;
  }
}

import { Component, Inject, inject, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatButtonModule } from '@angular/material/button';
import {
  MatCard,
  MatCardHeader,
  MatCardTitle,
  MatCardContent,
  MatCardActions,
} from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Payment } from '../../../interfaces/payment';
import firebase from 'firebase/compat/app';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FinanceService } from '../../../services/finance.service';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { map, Observable, startWith } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import moment from 'moment';
import { PaymentType } from '../../../interfaces/payment-type';

export const MY_DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-payment-dialog',
  standalone: true,
  imports: [
    MatCard,
    MatButtonModule,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCardActions,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    AsyncPipe,
  ],
  templateUrl: './payment-dialog.component.html',
  styleUrl: './payment-dialog.component.scss',
  providers: [provideMomentDateAdapter(MY_DATE_FORMAT)],
})
export class PaymentDialogComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<PaymentDialogComponent>);
  private afAuth = inject(AngularFireAuth);
  private db = inject(AngularFirestore);
  private snackbar = inject(MatSnackBar);
  financeService = inject(FinanceService);

  constructor(@Inject(MAT_DIALOG_DATA) public data: { selectedDate: Date }) {}

  myControl = new FormControl('');
  amount: number = 0;
  description: string = '';
  person: string = '';
  date = new FormControl(new Date());

  descriptionControl = new FormControl('');
  descriptions = this.financeService.paymentSubtypeArray;
  filteredDescriptions: Observable<PaymentType[]> = new Observable<
    PaymentType[]
  >();

  async ngOnInit() {
    this.filteredDescriptions = this.descriptionControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );

    this.descriptionControl.valueChanges.subscribe((value) => {
      this.description = value || '';
    });
  }

  async send() {
    const user = await this.afAuth.currentUser;
    const userId = user?.uid || 'defaultUser';
    const month = new Date(this.data.selectedDate);

    let selectedDate: Date;
    if (this.date.value) {
      if (moment.isMoment(this.date.value)) {
        selectedDate = this.date.value.startOf('day').toDate();
      } else {
        const date = new Date(this.date.value);
        selectedDate = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate()
        );
      }
    } else {
      const now = new Date();
      selectedDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }

    const payment: Payment = {
      amount: this.amount,
      description: this.description,
      date: selectedDate,
      user: user?.uid || 'defaultUser',
      type: this.myControl.value || 'Other',
      month: month,
      person: this.person,
    };

    const docId = `${userId}_${month.getFullYear()}-${month.getMonth() + 1}`;
    const transactionDocRef = this.db.collection('transactions').doc(docId);

    await transactionDocRef.set(
      {
        user: userId,
        month,
        date: new Date(),
        payment: firebase.firestore.FieldValue.arrayUnion(payment),
      },
      { merge: true }
    );

    this.snackbar.open('Payment saved successfully', 'Close', {
      duration: 3000,
    });
    this.dialogRef.close(true);
  }

  private _filter(value: string): PaymentType[] {
    if (!value) {
      return this.descriptions();
    }
    const filterValue = value.toLowerCase();
    return this.descriptions().filter((option: PaymentType) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }
}

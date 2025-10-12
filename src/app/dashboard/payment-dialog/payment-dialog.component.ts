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
  ],
  templateUrl: './payment-dialog.component.html',
  styleUrl: './payment-dialog.component.scss',
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

  async ngOnInit() {}

  async send() {
    const user = await this.afAuth.currentUser;
    const userId = user?.uid || 'defaultUser';
    const month = new Date(this.data.selectedDate);

    const payment: Payment = {
      amount: this.amount,
      description: this.description,
      date: new Date(),
      user: user?.uid || 'defaultUser',
      type: this.myControl.value || 'Other',
      month: month,
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
}

import { Component, inject, OnInit } from '@angular/core';
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
import { MatDialogRef } from '@angular/material/dialog';
import { Payment } from '../../../interfaces/payment';
import firebase from 'firebase/compat/app';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, Observable } from 'rxjs';
import { PaymentType } from '../../../interfaces/payment-type';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

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

  myControl = new FormControl('');
  amount: number = 0;
  description: string = '';
  // paytype: string[] = [
  //   'Groceries',
  //   'Apartment',
  //   'Internet',
  //   'Phone',
  //   'Kuma',
  //   'Restaurants',
  //   'Home chemicals',
  //   'Selfcare',
  //   'Transport',
  //   'Clothes',
  //   'Other',
  // ];

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
  paymentType = toSignal(this.paymentType$, {
    initialValue: [] as PaymentType[],
  });

  async ngOnInit() {
    // const user = await this.afAuth.currentUser;
    // const userId = user?.uid || 'defaultUser';
    // const docId = `${userId}`;
    // const transactionDocRef = this.db.collection('payment-type').doc(docId);
    //   let payment: PaymentType = {
    //     name: this.paytype,
    //   };
    //   transactionDocRef.set(payment);
  }

  async send() {
    const user = await this.afAuth.currentUser;
    const userId = user?.uid || 'defaultUser';
    const month = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const payment: Payment = {
      amount: this.amount,
      description: this.description,
      date: new Date(),
      user: user?.uid || 'defaultUser',
      type: this.myControl.value || 'Other',
      month: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    };

    const docId = `${userId}`;
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
    this.dialogRef.close(true);
  }
}

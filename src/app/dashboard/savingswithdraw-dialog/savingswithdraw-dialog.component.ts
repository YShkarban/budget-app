import { Component, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Budget } from '../../../interfaces/budget';
import { Savings } from '../../../interfaces/savings';
import firebase from 'firebase/compat/app';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-savingswithdraw-dialog',
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
  ],
  templateUrl: './savingswithdraw-dialog.component.html',
  styleUrl: './savingswithdraw-dialog.component.scss',
})
export class SavingswithdrawDialogComponent {
  private dialogRef = inject(MatDialogRef<SavingswithdrawDialogComponent>);
  private afAuth = inject(AngularFireAuth);
  private db = inject(AngularFirestore);
  private snackbar = inject(MatSnackBar);

  amount: number = 0;
  description: string = '';

  async send() {
    const user = await this.afAuth.currentUser;
    const userId = user?.uid || 'defaultUser';
    const month = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const budget: Budget = {
      amount: this.amount,
      description: this.description,
      date: new Date(),
      user: user?.uid || 'defaultUser',
      month: month,
    };

    const saving: Savings = {
      amount: -this.amount,
      description: this.description,
      date: new Date(),
      user: user?.uid || 'defaultUser',
    };

    const docId = `${userId}`;
    const transactionDocRef = this.db.collection('transactions').doc(docId);

    await transactionDocRef.set(
      {
        user: userId,
        month,
        date: new Date(),
        budget: firebase.firestore.FieldValue.arrayUnion(budget),
      },
      { merge: true }
    );

    const savingsDocRef = this.db.collection('savings').doc(docId);
    await savingsDocRef.set(
      {
        array: firebase.firestore.FieldValue.arrayUnion(saving),
      },
      { merge: true }
    );
    this.snackbar.open('Savings moved to budget successfully', 'Close', {
      duration: 3000,
    });
    this.dialogRef.close(true);
  }
}

import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatCard,
  MatCardHeader,
  MatCardTitle,
  MatCardContent,
  MatCardActions,
} from '@angular/material/card';
import { MatDialogRef } from '@angular/material/dialog';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { Savings } from '../../../interfaces/savings';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-savings-dialog',
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
  templateUrl: './savings-dialog.component.html',
  styleUrl: './savings-dialog.component.scss',
})
export class SavingsDialogComponent {
  private dialogRef = inject(MatDialogRef<SavingsDialogComponent>);
  private afAuth = inject(AngularFireAuth);
  private db = inject(AngularFirestore);
    private snackbar = inject(MatSnackBar);

  amount: number = 0;
  description: string = '';

  async send() {
    const user = await this.afAuth.currentUser;
    const userId = user?.uid || 'defaultUser';
    const month = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const saving: Savings = {
      amount: this.amount,
      description: this.description,
      date: new Date(),
      user: user?.uid || 'defaultUser',
      month: month,
    };
    
    const docId = `${userId}`;
    const transactionDocRef = this.db.collection('transactions').doc(docId);

    await transactionDocRef.set(
      {
        user: userId,
        month,
        date: new Date(),
        savings: firebase.firestore.FieldValue.arrayUnion(saving),
      },
      { merge: true }
    );
    this.snackbar.open('Funds added to savings successfully', 'Close', {
      duration: 3000,
    });
    this.dialogRef.close(true);
  }
}

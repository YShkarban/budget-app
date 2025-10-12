import { Component, Inject, inject } from '@angular/core';
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
import { Budget } from '../../../interfaces/budget';
import firebase from 'firebase/compat/app';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-budget-dialog',
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
  templateUrl: './budget-dialog.component.html',
  styleUrl: './budget-dialog.component.scss',
})
export class BudgetDialogComponent {
  private dialogRef = inject(MatDialogRef<BudgetDialogComponent>);
  private afAuth = inject(AngularFireAuth);
  private db = inject(AngularFirestore);
  private snackbar = inject(MatSnackBar);

  constructor(@Inject(MAT_DIALOG_DATA) public data: { selectedDate: Date }) {}

  amount: number = 0;
  description: string = '';

  async send() {
    console.log(this.data.selectedDate);
    const user = await this.afAuth.currentUser;
    const userId = user?.uid || 'defaultUser';
    const month = new Date(this.data.selectedDate);

    const budget: Budget = {
      amount: this.amount,
      description: this.description,
      date: new Date(),
      user: user?.uid || 'defaultUser',
      month: month,
    };

    const docId = `${userId}_${month.getFullYear()}-${month.getMonth() + 1}`;
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
    this.snackbar.open('Funds added to budget successfully', 'Close', {
      duration: 3000,
    });
    this.dialogRef.close(true);
  }
}

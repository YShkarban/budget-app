import { Component, inject } from '@angular/core';
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
import { Budget } from '../../../interfaces/budget';
import firebase from 'firebase/compat/app';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

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
      month: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
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
    this.dialogRef.close(true);
  }
}

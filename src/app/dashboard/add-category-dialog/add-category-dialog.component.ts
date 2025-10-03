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
import { MatSnackBar } from '@angular/material/snack-bar';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-add-category-dialog',
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
  templateUrl: './add-category-dialog.component.html',
  styleUrl: './add-category-dialog.component.scss',
})
export class AddCategoryDialogComponent {
  private dialogRef = inject(MatDialogRef<AddCategoryDialogComponent>);
  private afAuth = inject(AngularFireAuth);
  private db = inject(AngularFirestore);
  private snackbar = inject(MatSnackBar);

  categoryName: string = '';

  async send() {
    this.categoryName = this.categoryName.trim();
    if (this.categoryName.length === 0) {
      this.snackbar.open('Category name is empty', 'Close', {
        duration: 3000,
      });
      return;
    }

    const user = await this.afAuth.currentUser;
    const userId = user?.uid || 'defaultUser';
    const docId = `${userId}`;

    const transactionDocRef = this.db.collection('payment-type').doc(docId);
    await transactionDocRef.set(
      {
        name: firebase.firestore.FieldValue.arrayUnion(this.categoryName),
      },
      { merge: true }
    );
    this.snackbar.open('Category was added', 'Close', {
      duration: 3000,
    });
    this.dialogRef.close(true);
  }
}

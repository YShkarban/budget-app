import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  readonly email = new FormControl('', [Validators.required, Validators.email]);
  readonly password = new FormControl('', [Validators.required]);

  errorMessage = signal('');
  errorSign: boolean = false;

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.email.hasError('email')) {
      this.errorMessage.set('Not a valid email');
    } else {
      this.errorMessage.set('');
    }
  }

  async onSignIn() {
    if (this.email.valid && this.password.valid) {
      const email = this.email.value!;
      const password = this.password.value!;
      try {
        const userCredential = await this.authService.login(email, password);
        if (userCredential && userCredential.user) {
          this.router.navigate(['dashboard']);
          this.errorSign = false;
        }
      } catch (error: any) {
        this.errorSign = true;
        let message = 'User not found or incorrect credentials';
        if (error?.code === 'auth/invalid-credential') {
          message =
            'The supplied auth credential is incorrect, malformed or has expired.';
        } else if (error?.message) {
          message = error.message;
        }
        this.snackBar.open(message, 'Close', { duration: 4000 });
      }
    }
  }
}

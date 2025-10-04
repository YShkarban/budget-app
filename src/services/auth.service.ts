import { Injectable, signal } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userId = signal<string | null>(null);
  isLoggedIn = signal(false);

  userId$ = this.afAuth.authState.pipe(map((user) => user?.uid ?? null));
  
  constructor(private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe((user) => {
      this.userId.set(user?.uid ?? null);
      this.isLoggedIn.set(!!user);
    });
  }

  async login(email: string, password: string) {
    const result = await this.afAuth.signInWithEmailAndPassword(
      email,
      password
    );
    this.userId.set(result.user?.uid || null);
    this.isLoggedIn.set(!!result.user);
    return result;
  }

  async logout() {
    await this.afAuth.signOut();
    this.userId.set(null);
    this.isLoggedIn.set(false);
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }
}

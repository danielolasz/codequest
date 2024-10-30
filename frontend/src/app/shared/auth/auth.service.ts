import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedInuser: User | undefined;

  setUser(user: User): void {
    this.loggedInuser = user;
  }

  getUser(): User | undefined {
    return this.loggedInuser;
  }

  clearUser(): void {
    this.loggedInuser = undefined;
  }
}

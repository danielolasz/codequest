import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedInuser: User | undefined;

  setUser(user: User): void {
    this.loggedInuser = user;
    localStorage.setItem('loggedInUser', JSON.stringify(user));
  }

  getUser(): User | undefined {
    if (!this.loggedInuser) {
      const userJson = localStorage.getItem('loggedInUser');
      if (userJson) {
        this.loggedInuser = JSON.parse(userJson) as User;
      }
    }
    return this.loggedInuser;
  }

  clearUser(): void {
    this.loggedInuser = undefined;
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('jwtToken');
  }
}

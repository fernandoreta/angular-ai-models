import { Injectable } from '@angular/core';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, UserCredential } from '@angular/fire/auth';
import { CookieService } from 'ngx-cookie-service';
import { IUser } from 'src/interfaces/models.interface';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(
    private cookieService: CookieService
  ) { }
  
  setCookie(cookie: string) {
    this.cookieService.set('user', cookie);
  }

  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(getAuth(), email, password);
  }

  register(user: IUser) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }
}

import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationClient} from '../clients/authentication.client';
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserRole} from "../models/user-role.enum";
import {Result} from "../models/result.model";
import {HttpErrorResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private token = 'token';

  constructor(
    private authenticationClient: AuthenticationClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  public login(email: string, password: string): void {
    this.authenticationClient.login(email, password).subscribe({
        next: (result) => {
            this.handleSuccessAuthentication(result);
        },
        error: (error: HttpErrorResponse) => {
            this.handleFailedAuthentication(error);
        }
    });
  }

  public register(firstname: string, lastname: string, role: UserRole, email: string, password: string): void {
    this.authenticationClient
      .register(firstname, lastname, role, email, password)
      .subscribe({
          next: (result) => {
              this.handleSuccessAuthentication(result);
          },
          error: (error: HttpErrorResponse) => {
              this.handleFailedAuthentication(error);
          }
      });
  }

  public logout() {
    localStorage.removeItem(this.token);
    this.router.navigate(['/login']);
  }


    public isLoggedIn(): boolean {
        let token = localStorage.getItem(this.token);
        return token != null && token.length > 0;
    }

    public getToken(): string | null {
        return this.isLoggedIn() ? localStorage.getItem(this.token) : null;
    }

    private handleSuccessAuthentication(result: Result): void {
        let message;

        if (result !== null && result.token.length > 1) {

            localStorage.setItem(this.token, result.token);

            this.router.navigate(['/']);
            message = 'User has been authenticated.';
        } else if (result !== null) {
          message = result.errors.join(' ');
        } else {
            message = 'Something went wrong.';
        }

        this.snackBar.open(message, 'Close');
    }
  private handleFailedAuthentication(error: HttpErrorResponse): void {

    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }

    this.snackBar.open(error.error, 'Close');
  }
}

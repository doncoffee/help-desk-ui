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
    private snackBar: MatSnackBar,
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

  public logout(): void {
    this.authenticationClient.logout().subscribe(
      () => {
        this.handleLogout();
      },
      (error: HttpErrorResponse) => {
        this.handleFailedLogout(error);
      }
    );
  }

  private handleLogout(): void {
    localStorage.removeItem(this.token);
    this.router.navigate(['/login']);
    this.snackBar.open("Logged out successfully", 'Close', {duration: 5000});
  }

  private handleFailedLogout(error: HttpErrorResponse): void {
    console.error('Logout failed:', error);
    this.snackBar.open('Logout failed', 'Close', {duration: 5000});
  }


    public isLoggedIn(): boolean {
        let token = localStorage.getItem(this.token);
        return token != null && token.length > 0;
    }

  public isJwtExpired(): boolean {
    let token = localStorage.getItem(this.token);
    if (token == null) return false;
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }

    public getToken(): string | null {
        return this.isLoggedIn() ? localStorage.getItem(this.token) : null;
    }

    private handleSuccessAuthentication(result: Result): void {
        let message;

        if (result !== null && result.token.length > 1) {

            localStorage.setItem(this.token, result.token);

            this.router.navigate(['/tickets']);
            message = 'User has been authenticated.';
        } else if (result !== null) {
          message = result.errors.join(' ');
        } else {
            message = 'Something went wrong.';
        }

        this.snackBar.open(message, 'Close', {duration: 5000});
    }
  private handleFailedAuthentication(error: HttpErrorResponse): void {

    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }

    this.snackBar.open(error.error, 'Close', {duration: 5000});
  }
}

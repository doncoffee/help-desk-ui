export class User {
  public email: string;
  public roles: string[];
  public token: string;

  constructor(email: string, roles: string[], token: string) {
    this.email = email;
    this.roles = roles;
    this.token = token;
  }
}

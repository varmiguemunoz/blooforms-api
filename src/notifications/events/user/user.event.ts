import { DimUsuarios } from 'src/entities/users.entity';

export class UserEvent {
  private user: DimUsuarios;

  constructor(user: DimUsuarios) {
    this.user = user;
  }

  public getUser() {
    return this.user;
  }
}

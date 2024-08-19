import { Users } from 'src/entities/users.entity';

export class UserEvent {
  private user: Users;

  constructor(user: Users) {
    this.user = user;
  }

  public getUser() {
    return this.user;
  }
}

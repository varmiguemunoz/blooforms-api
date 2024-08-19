import { Users } from 'src/entities/users.entity';
import { UserEvent } from './user.event';

export class UserForgotPasswordEvent extends UserEvent {
  private resetPasswordLink: string;

  constructor(user: Users, resetPasswordLink: string) {
    super(user);
    this.resetPasswordLink = resetPasswordLink;
  }

  public getResetPasswordLink() {
    return this.resetPasswordLink;
  }
}

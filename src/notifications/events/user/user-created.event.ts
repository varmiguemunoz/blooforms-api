import { UserEvent } from './user.event';
import { DimUsuarios } from 'src/entities/users.entity';

export class UserCreatedEvent extends UserEvent {
  private resetPasswordLink: string;

  constructor(user: DimUsuarios, resetPasswordLink: string) {
    super(user);
    this.resetPasswordLink = resetPasswordLink;
  }

  public getResetPasswordLink() {
    return this.resetPasswordLink;
  }
}

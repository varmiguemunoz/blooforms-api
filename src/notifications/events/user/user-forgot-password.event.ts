import { DimUsuarios } from 'src/entities/dim-usuarios.entity';
import { UserEvent } from './user.event';

export class UserForgotPasswordEvent extends UserEvent {
  private resetPasswordLink: string;

  constructor(user: DimUsuarios, resetPasswordLink: string) {
    super(user);
    this.resetPasswordLink = resetPasswordLink;
  }

  public getResetPasswordLink() {
    return this.resetPasswordLink;
  }
}

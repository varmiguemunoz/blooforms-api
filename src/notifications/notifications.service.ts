import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { UserCreatedEvent } from './events/user/user-created.event';
import { EVENT_TYPES } from './event-types';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';
import { UserForgotPasswordEvent } from './events/user/user-forgot-password.event';

@Injectable()
export class NotificationsService {
  constructor(private eventEmitter: EventEmitter2) {}

  getTemplate(templateName: string) {
    return fs.readFileSync(
      path.join(__dirname, 'templates', `${templateName}.hbs`),
      'utf8',
    );
  }

  @OnEvent(EVENT_TYPES.USER_FORGOT_PASSWORD)
  async handleUserForgotPassword(event: UserForgotPasswordEvent) {
    const templateHtml = this.getTemplate('user-forgot-password');
    const template = handlebars.compile(templateHtml);
    const html = template({
      resetPasswordLink: event.getResetPasswordLink(),
      user: event.getUser(),
    });

    this.eventEmitter.emit(EVENT_TYPES.NOTIFICATION_SEND_EMAIL, {
      recipients: [event.getUser().email],
      subject: '¿Olvidaste tu contraseña? ¡No te preocupes!',
      htmlMessage: html,
    });
  }

  @OnEvent(EVENT_TYPES.USER_SET_PASSWORD)
  async handleUserCreatedEvent(event: UserCreatedEvent) {
    const templateHtml = this.getTemplate('user-set-password');
    const template = handlebars.compile(templateHtml);
    const html = template({
      resetPasswordLink: event.getResetPasswordLink(),
      user: event.getUser(),
    });

    this.eventEmitter.emit(EVENT_TYPES.NOTIFICATION_SEND_EMAIL, {
      recipients: [event.getUser().email],
      subject: `¡Bienvenido a Blooforms!`,
      htmlMessage: html,
    });
  }
}

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignInResponseDto } from './dto/signin-response-dto';
import { ConfigService } from '@nestjs/config';
import {
  RefreshTokenDto,
  RefreshTokenResponseDto,
} from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    // private eventEmmiter: EventEmitter2,
  ) {}

  async signIn(email: string, password: string): Promise<SignInResponseDto> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user)
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.BAD_REQUEST,
      );

    const isPasswordValid = await this.usersService.validatePassword(
      password,
      user.usuario.password,
    );

    if (!isPasswordValid)
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.BAD_REQUEST,
      );

    //! TODO: encrypt token data
    const payload = {
      sub: user.id,
      email: user.usuario.email,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get<string>(
        'auth.jwtRefreshExpirationTime',
      ),
      secret: this.configService.get<string>('auth.jwtRefreshSecret'),
    });

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async refreshAccessToken(
    refreshData: RefreshTokenDto,
  ): Promise<RefreshTokenResponseDto> {
    const { refreshToken, tokenPayload } = refreshData;
    try {
      const { sub, email, role, empresa } = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: this.configService.get<string>('auth.jwtRefreshSecret'),
        },
      );

      if (email !== tokenPayload.email)
        throw new HttpException(
          'Invalid refresh token',
          HttpStatus.UNAUTHORIZED,
        );

      const accessToken = await this.jwtService.signAsync(
        { sub, email, role, empresa },
        {
          expiresIn: this.configService.get<string>('auth.jwtExpirationTime'),
        },
      );

      return { accessToken };
    } catch (error) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }
  }

  // @OnEvent(EVENT_TYPES.USER_CREATED)
  // async onUserCreated(user: FacUsuarios) {
  //   const payload = {
  //     sub: user.id,
  //   };

  //   const resetToken = await this.jwtService.signAsync(payload, {
  //     expiresIn: this.configService.get<string>(
  //       'auth.jwtSetPasswordExpirationTime',
  //     ),
  //     secret: this.configService.get<string>('auth.jwtResetPasswordSecret'),
  //   });
  //   const resetPasswordLink = `${this.configService.get<string>(
  //     'auth.frontendUrl',
  //   )}/reset-password?resetToken=${resetToken}`;

  //   this.eventEmmiter.emit(
  //     EVENT_TYPES.USER_SET_PASSWORD,
  //     new UserCreatedEvent(user.usuario, resetPasswordLink),
  //   );
  // }
}

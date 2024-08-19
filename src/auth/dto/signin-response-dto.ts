import { FacUsers } from 'src/entities/fac-users.entity';

export class SignInResponseDto {
  accessToken: string;
  refreshToken: string;
  user: FacUsers;
}

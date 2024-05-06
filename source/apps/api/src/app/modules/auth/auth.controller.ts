import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('authenticate')
  async authenticate(@Body() data: { email: string; password: string }) {
    console.log({ data });
    const { email, password } = data;
    try {
      const res = await this.auth.checkLogin(email, password);
      return res;
    } catch (err) {
      console.error(err);
      throw new HttpException('Unauthorized', 401);
    }
  }
}

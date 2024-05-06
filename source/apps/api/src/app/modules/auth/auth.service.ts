import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../modules/user/user.service';
import { UserEntity } from '../../modules/user/user.entity';
import { throwError } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async checkLogin(
    email: string,
    pass: string
  ): Promise<null | { token: string }> {
    const user = await this.userService.findByEmail(email);
    console.log({ user });
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return this.generateToken(result);
    }
    throw new Error('Wrong credentials');
  }

  async generateToken(user: Partial<UserEntity>) {
    const payload = { email: user.email, sub: user.id };
    return {
      token: this.jwtService.sign(payload),
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }
}

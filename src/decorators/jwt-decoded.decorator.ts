import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface JwtPayload {
  userId: string;
  username: string;
}

export interface JwtDecode {
  decoded: JwtPayload;
}

export const JwtDecode = createParamDecorator(
  async (_, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const jwtService = new JwtService({ secret: process.env.JWT_SECRET });

    try {
      const decoded = jwtService.verify(token) as JwtDecode;
      return decoded;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  },
);

import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserRepository } from 'src/modules/user/user.repository';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException();

    const payload = await this.validateToken(token);

    const user = await UserRepository.getUserById(payload.userId);
    if (!user) throw new UnauthorizedException('User not found');

    request['user'] = payload;
    return true;
  }

  private async validateToken(token: string) {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch {
      throw new NetworkAuthenticationRequiredException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

export class NetworkAuthenticationRequiredException extends HttpException {
  constructor() {
    super('Token expirado. É necessário realizar o login novamente.', 511);
  }

  public getResponse() {
    return {
      statusCode: 511,
      message: this.message,
    };
  }
}

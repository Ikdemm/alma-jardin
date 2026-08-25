import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AuthAdmin } from '@alma-jardin/shared';

export const CurrentAdmin = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthAdmin => {
    const request = context.switchToHttp().getRequest<{ user: AuthAdmin }>();
    return request.user;
  },
);

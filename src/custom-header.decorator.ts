import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CustomHeader = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers[data.toLowerCase()];
  },
);

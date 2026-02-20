import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { registerDecorator, ValidationOptions } from 'class-validator';

const passwordPattern =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isStrongPassword',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!value || typeof value !== 'string') {
            return false;
          }
          return passwordPattern.test(value);
        },
      },
    });
  };
}

export const GetUser = createParamDecorator((_, context: ExecutionContext) => {
  const req = context.switchToHttp().getRequest();
  return req.user;
});

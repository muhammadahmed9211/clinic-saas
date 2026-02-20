import { HttpStatus, ValidationError } from '@nestjs/common';
import { I18nValidationExceptionFilterErrorFormatterOption } from 'nestjs-i18n';

// const getNestedError = (error: ValidationError[]) => {
//   const firstError = error[0];
//   const constraints = firstError.constraints;
//   if (!constraints && firstError.children) {
//     return getNestedError(firstError.children);
//   }
//   return constraints;
// };

const getNestedError = (
  error: ValidationError[],
): { [type: string]: string } | object => {
  if (error.length === 0) {
    return {};
  }
  const firstError = error[0];
  const constraints = firstError.constraints;
  if (!constraints) {
    if (firstError.children && firstError.children.length > 0) {
      return getNestedError(firstError.children);
    } else {
      return {};
    }
  }
  return constraints || {};
};

function generateErrors(error: ValidationError[]) {
  // const firstConstraint = Object.values(getNestedError(error))[0] || null;
  const nestedError = getNestedError(error);
  const firstConstraint =
    nestedError && Object.keys(nestedError).length > 0
      ? Object.values(nestedError)[0]
      : null;

  return {
    msg: firstConstraint,
  };
}

const validationOptions: I18nValidationExceptionFilterErrorFormatterOption = {
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  errorFormatter: (errors: ValidationError[]) => {
    return generateErrors(errors);
  },
  responseBodyFormatter: (host, exc, formattedErrors) => {
    return {
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      error: formattedErrors,
    };
  },
};

// const validationOptions: ValidationPipeOptions = {
//   transform: true,
//   whitelist: true,
//   errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
//   exceptionFactory: (error: ValidationError[]) => {
//     return new HttpException(
//       {
//         status: HttpStatus.UNPROCESSABLE_ENTITY,
//         error: generateErrors(error),
//       },
//       HttpStatus.UNPROCESSABLE_ENTITY,
//     );
//   },
// };

export default validationOptions;

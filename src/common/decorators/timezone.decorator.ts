import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import moment from 'moment-timezone';

export const ConvertTimezone = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const dateTime = new Date(); // UTC time from request body
    const userTimeZone = request.headers.user_time_zone; // Get timezone from request

    // Validate inputs
    if (!dateTime) {
      throw new BadRequestException('DateTime is required');
    }

    if (!userTimeZone) {
      throw new BadRequestException('user_time_zone is required');
    }

    // Validate if the timezone is valid
    if (!moment.tz.zone(userTimeZone)) {
      throw new BadRequestException('Invalid timezone provided');
    }

    try {
      const convertedTime = moment
        .utc(dateTime)
        .tz(userTimeZone)
        .format('YYYY-MM-DD HH:mm:ss.SSS');

      // Ensure milliseconds are exactly 3 digits (pad with zeros if needed)
      // This matches MSSQL's precision for datetime
      const [datePart, timePart] = convertedTime.split(' ');
      const [time, ms] = timePart.split('.');
      const paddedMs = ms.padEnd(3, '0').slice(0, 3);
      const utcOffsetMinutes = moment.tz(userTimeZone).utcOffset();

      return {userDate:`${datePart} ${time}.${paddedMs}`, utcOffsetMinutes };
    } catch (error) {
      throw new BadRequestException('Invalid datetime format');
    }
  },
);

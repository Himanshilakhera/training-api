import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';

type ErrorResponse = {
  success: false;
  statusCode: number;
  timestamp: string;
  path: string;
  error: string;
};

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();
    const statusCode = exception.getStatus();

    const errorResponse: ErrorResponse = {
      success: false,
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: this.getErrorMessage(exception),
    };

    response.status(statusCode).json(errorResponse);
  }

  private getErrorMessage(exception: HttpException): string {
    const exceptionResponse = exception.getResponse();

    if (typeof exceptionResponse === 'string') {
      return exceptionResponse;
    }

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const message = (exceptionResponse as { message?: unknown }).message;

      if (Array.isArray(message)) {
        return message.filter((item): item is string => typeof item === 'string').join('; ');
      }

      if (typeof message === 'string') {
        return message;
      }
    }

    return HttpStatus[exception.getStatus()] ?? 'Http Exception';
  }
}
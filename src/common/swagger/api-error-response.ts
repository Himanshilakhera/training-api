import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ApiErrorResponseDto } from './api-error-response.dto';

export const ApiErrorResponse = (
  status: number,
  description: string,
  errorExample: string,
) =>
  applyDecorators(
    ApiExtraModels(ApiErrorResponseDto),
    ApiResponse({
      status,
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiErrorResponseDto) },
          {
            properties: {
              success: {
                type: 'boolean',
                example: false,
              },
              statusCode: {
                type: 'integer',
                example: status,
              },
              timestamp: {
                type: 'string',
                format: 'date-time',
                example: '2026-09-24T10:00:00.000Z',
              },
              path: {
                type: 'string',
                example: '/api/v1/auth/{resource}',
              },
              error: {
                type: 'string',
                example: errorExample,
              },
            },
          },
        ],
      },
    }),
  );

import { Type, applyDecorators } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ApiResponseWrapper } from './api-response-wrapper.dto';

export type ApiSuccessResponseOptions<T> = {
  description?: string;
  status?: 200 | 201;
  isArray?: boolean;
  dataType?: T;
};

export const ApiSuccessResponse = <T extends Type<any>>(
  model: T,
  options: Omit<ApiSuccessResponseOptions<T>, 'dataType'> = {},
) => {
  const status = options.status ?? 200;
  const description = options.description ?? 'Successful response.';
  const ResponseDecorator = status === 201 ? ApiCreatedResponse : ApiOkResponse;

  const dataSchema = options.isArray
    ? {
        type: 'array',
        items: { $ref: getSchemaPath(model) },
      }
    : { $ref: getSchemaPath(model) };

  return applyDecorators(
    ApiExtraModels(ApiResponseWrapper, model),
    ResponseDecorator({
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseWrapper) },
          {
            properties: {
              success: {
                type: 'boolean',
                example: true,
              },
              statusCode: {
                type: 'integer',
                example: status,
              },
              data: dataSchema,
            },
          },
        ],
      },
    }),
  );
};

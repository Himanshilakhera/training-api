import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiSuccessResponse } from './common/swagger/api-success-response';
import { AppService } from './app.service';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Health check',
    description: 'Returns a simple application health message.',
  })
  @ApiSuccessResponse(String, {
    status: 200,
    description: 'Application health check response.',
  })
  getHello(): string {
    return this.appService.getHello();
  }
}

import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
// import { ThirdPartyManager } from '@gitroom/nestjs-libraries/3rdparties/thirdparty.manager';  // DISABLED
import { GetOrgFromRequest } from '@gitroom/nestjs-libraries/user/org.from.request';
import { Organization } from '@prisma/client';
import { AuthService } from '@gitroom/helpers/auth/auth.service';
import { UploadFactory } from '@gitroom/nestjs-libraries/upload/upload.factory';
import { MediaService } from '@gitroom/nestjs-libraries/database/prisma/media/media.service';

@ApiTags('Third Party')
@Controller('/third-party')
export class ThirdPartyController {
  private storage = UploadFactory.createStorage();

  constructor(
    // private _thirdPartyManager: ThirdPartyManager,  // DISABLED
    private _mediaService: MediaService,
  ) {}

  @Get('/list')
  async getThirdPartyList() {
    return { message: "Third-party integrations disabled", data: [] };
  }

  @Get('/')
  async getSavedThirdParty(@GetOrgFromRequest() organization: Organization) {
    return { message: "Third-party integrations disabled", data: [] };
  }

  @Delete('/:id')
  deleteById(
    @GetOrgFromRequest() organization: Organization,
    @Param('id') id: string
  ) {
    throw new HttpException('Third-party integrations disabled', 400);
  }

  @Post('/:id/submit')
  async generate(
    @GetOrgFromRequest() organization: Organization,
    @Param('id') id: string,
    @Body() data: any
  ) {
    throw new HttpException('Third-party integrations disabled', 400);
  }

  @Post('/function/:id/:functionName')
  async callFunction(
    @GetOrgFromRequest() organization: Organization,
    @Param('id') id: string,
    @Param('functionName') functionName: string,
    @Body() data: any
  ) {
    throw new HttpException('Third-party integrations disabled', 400);
  }

  @Post('/:identifier')
  async addApiKey(
    @GetOrgFromRequest() organization: Organization,
    @Param('identifier') identifier: string,
    @Body('api') api: string
  ) {
    throw new HttpException('Third-party integrations disabled', 400);
  }
}

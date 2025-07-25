import { Body, Controller, Get, Param, Post, Req, Res, Query, BadRequestException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AgenciesService } from '@gitroom/nestjs-libraries/database/prisma/agencies/agencies.service';
import { PostsService } from '@gitroom/nestjs-libraries/database/prisma/posts/posts.service';
import { TrackService } from '@gitroom/nestjs-libraries/track/track.service';
import { RealIP } from 'nestjs-real-ip';
import { UserAgent } from '@gitroom/nestjs-libraries/user/user.agent';
import { TrackEnum } from '@gitroom/nestjs-libraries/user/track.enum';
import { Request, Response } from 'express';
import { makeId } from '@gitroom/nestjs-libraries/services/make.is';
import { getCookieUrlFromDomain } from '@gitroom/helpers/subdomain/subdomain.management';
// import { AgentGraphInsertService } from '@gitroom/nestjs-libraries/agent/agent.graph.insert.service';  // DISABLED
import { Nowpayments } from '@gitroom/nestjs-libraries/crypto/nowpayments';

@ApiTags('Public')
@Controller('/public')
export class PublicController {
  constructor(
    private _agenciesService: AgenciesService,
    private _trackService: TrackService,
    // private _agentGraphInsertService: AgentGraphInsertService,  // DISABLED
    private _postsService: PostsService,
    private _nowpayments: Nowpayments
  ) {}
  // @Post('/agent')  // DISABLED: Agent functionality
  // async createAgent(@Body() body: { text: string; apiKey: string }) {
  //   if (
  //     !body.apiKey ||
  //     !process.env.AGENT_API_KEY ||
  //     body.apiKey !== process.env.AGENT_API_KEY
  //   ) {
  //     return;
  //   }
  //   return this._agentGraphInsertService.newPost(body.text);
  // }

  @Get('/agencies-list')
  async getAgencyByUser() {
    return this._agenciesService.getAllAgencies();
  }

  @Get('/agencies-list-slug')
  async getAgencySlug() {
    return this._agenciesService.getAllAgenciesSlug();
  }

  @Get('/agencies-information/:agency')
  async getAgencyInformation(@Param('agency') agency: string) {
    return this._agenciesService.getAgencyInformation(agency);
  }

  @Get('/agencies-list-count')
  async getAgenciesCount() {
    return this._agenciesService.getCount();
  }

  @Get(`/posts/bulk`)
  async getBulkPosts(@Query('posts') postIds: string) {
    if (!postIds) {
      throw new BadRequestException('Posts parameter is required');
    }
    
    const ids = postIds.split(',').filter(Boolean);
    if (ids.length === 0) {
      throw new BadRequestException('No valid post IDs provided');
    }
    
    if (ids.length > 10) {
      throw new BadRequestException('Maximum 10 posts allowed');
    }
    
    try {
      const posts = await Promise.all(
        ids.map(async (id) => {
          try {
            return await this._postsService.getPostsRecursively(id, true);
          } catch (error) {
            console.warn(`Failed to fetch post ${id}:`, error);
            return [];
          }
        })
      );
      
      return posts.flat().map(({ childrenPost, ...p }) => ({
        ...p,
        ...(p.integration
          ? {
              integration: {
                id: p.integration.id,
                name: p.integration.name,
                picture: p.integration.picture,
                providerIdentifier: p.integration.providerIdentifier,
                profile: p.integration.profile,
              },
            }
          : {}),
      }));
    } catch (error) {
      console.error('Error fetching bulk posts:', error);
      throw new BadRequestException('Failed to fetch posts');
    }
  }

  @Get(`/posts/bulk/comments`)
  async getBulkComments(@Query('posts') postIds: string) {
    if (!postIds) {
      throw new BadRequestException('Posts parameter is required');
    }
    
    const ids = postIds.split(',').filter(Boolean);
    if (ids.length === 0) {
      throw new BadRequestException('No valid post IDs provided');
    }
    
    if (ids.length > 10) {
      throw new BadRequestException('Maximum 10 posts allowed');
    }
    
    try {
      const commentsMap: Record<string, any> = {};
      
      await Promise.all(
        ids.map(async (id) => {
          try {
            commentsMap[id] = await this._postsService.getComments(id);
          } catch (error) {
            console.warn(`Failed to fetch comments for post ${id}:`, error);
            commentsMap[id] = [];
          }
        })
      );
      
      return { comments: commentsMap };
    } catch (error) {
      console.error('Error fetching bulk comments:', error);
      throw new BadRequestException('Failed to fetch comments');
    }
  }

  @Get(`/posts/:id`)
  async getPreview(@Param('id') id: string) {
    return (await this._postsService.getPostsRecursively(id, true)).map(
      ({ childrenPost, ...p }) => ({
        ...p,
        ...(p.integration
          ? {
              integration: {
                id: p.integration.id,
                name: p.integration.name,
                picture: p.integration.picture,
                providerIdentifier: p.integration.providerIdentifier,
                profile: p.integration.profile,
              },
            }
          : {}),
      })
    );
  }

  @Get(`/posts/:id/comments`)
  async getComments(@Param('id') postId: string) {
    return { comments: await this._postsService.getComments(postId) };
  }

  @Post(`/posts/:id/comments`)
  async createAnonymousComment(
    @Param('id') postId: string,
    @RealIP() ip: string,
    @UserAgent() userAgent: string,
    @Body() body: { comment: string; clientName?: string; clientEmail?: string }
  ) {
    return this._postsService.createAnonymousComment(postId, body.comment, {
      clientName: body.clientName,
      clientEmail: body.clientEmail,
      ip,
      userAgent,
    });
  }

  @Post('/t')
  async trackEvent(
    @Res() res: Response,
    @Req() req: Request,
    @RealIP() ip: string,
    @UserAgent() userAgent: string,
    @Body()
    body: { fbclid?: string; tt: TrackEnum; additional: Record<string, any> }
  ) {
    const uniqueId = req?.cookies?.track || makeId(10);
    const fbclid = req?.cookies?.fbclid || body.fbclid;
    await this._trackService.track(
      uniqueId,
      ip,
      userAgent,
      body.tt,
      body.additional,
      fbclid
    );
    if (!req.cookies.track) {
      res.cookie('track', uniqueId, {
        domain: getCookieUrlFromDomain(process.env.FRONTEND_URL!),
        ...(!process.env.NOT_SECURED
          ? {
              secure: true,
              httpOnly: true,
            }
          : {}),
        sameSite: 'none',
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
      });
    }

    if (body.fbclid && !req.cookies.fbclid) {
      res.cookie('fbclid', body.fbclid, {
        domain: getCookieUrlFromDomain(process.env.FRONTEND_URL!),
        ...(!process.env.NOT_SECURED
          ? {
              secure: true,
              httpOnly: true,
            }
          : {}),
        sameSite: 'none',
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
      });
    }

    res.status(200).json({
      track: uniqueId,
    });
  }

  @Post('/crypto/:path')
  async cryptoPost(@Body() body: any, @Param('path') path: string) {
    console.log('cryptoPost', body, path);
    return this._nowpayments.processPayment(path, body);
  }
}

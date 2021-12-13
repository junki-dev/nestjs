import { Body, Controller, Get, Logger, Post, Request, UseGuards } from '@nestjs/common';
import { CustomRepositoryCannotInheritRepositoryError } from 'typeorm';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Doc } from './doc.entity';
import { DocService } from './doc.service';
import { CreateDocDto } from './dto/create-doc-dto';

@Controller('doc')
export class DocController {
  private readonly logger = new Logger(DocController.name);
  constructor(private readonly docService: DocService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req: any): Promise<Doc[]> {
    this.logger.log(`[GET]/doc api call`);
    return await this.docService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('inbox')
  async inbox(@Request() req: any): Promise<Doc[]> {
    this.logger.log(`[GET]/doc/inbox api call ${req.user.id}`);
    return await this.docService.findInbox(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('outbox')
  async outbox(@Request() req: any): Promise<Doc[]> {
    this.logger.log(`[GET]/outbox api call ${req.user.id}`);
    return await this.docService.findOutbox(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('archive')
  async archive(@Request() req: any): Promise<Doc[]> {
    this.logger.log(`[GET]/archive api call ${req.user.id}`);
    return await this.docService.findArchive(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('number/:docNumber')
  async findByDocNumber(@Request() req: any): Promise<Doc> {
    this.logger.log(`[GET]/findByDocNumber api call ${req.user.id}`);
    return await this.docService.findByDocNumber(req.params.docNumber);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req: any, @Body() createDoc: CreateDocDto): Promise<string> {
    this.logger.log(`[POST]/doc api call ${req.user.id}`);
    return await this.docService.create(req.user.id, createDoc);
  }

  @UseGuards(JwtAuthGuard)
  @Post('approval')
  async approval(@Request() req: any): Promise<string> {
    this.logger.log(`[POST]/approval api call ${req.user.id}`);
    return await this.docService.updateApprove(req.user.id, req.body);
  }
}

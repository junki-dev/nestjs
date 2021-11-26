import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Doc } from './doc.entity';
import { DocService } from './doc.service';
import { CreateDocDto } from './dto/create-doc-dto';

@ApiTags('Document')
@Controller('doc')
export class DocController {
  constructor(private readonly docService: DocService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Document 조회 API', description: 'Document 목록을 조회한다.' })
  @ApiCreatedResponse({ description: 'Document 목록을 조회한다.', type: [Doc] })
  async findAll(@Request() req: any): Promise<Doc[]> {
    console.log(`call doc findAll`);
    return await this.docService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Document 생성 API', description: 'Document 데이터를 생성한다.' })
  @ApiCreatedResponse({ description: 'Document 데이터를 생성한다.', type: Doc })
  async create(@Body() createDocDto: CreateDocDto): Promise<Doc> {
    console.log(`call doc create ${createDocDto}`);
    return await this.docService.create(createDocDto);
  }
}

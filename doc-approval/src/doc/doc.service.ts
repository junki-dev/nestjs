import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Doc } from './doc.entity';
import { CreateDocDto } from './dto/create-doc-dto';

@Injectable()
export class DocService {
  constructor(
    @InjectRepository(Doc)
    private readonly docRepository: MongoRepository<Doc>,
  ) {}

  async findAll(): Promise<Doc[]> {
    return this.docRepository.find();
  }

  async create(docDto: CreateDocDto): Promise<Doc> {
    const newDoc = new Doc();
    newDoc.title = docDto.title;
    newDoc.type = docDto.type;
    newDoc.content = docDto.content;
    newDoc.drafter = docDto.drafter;
    newDoc.firstApproval = docDto.firstApproval;
    newDoc.secondApproval = docDto.secondApproval;
    newDoc.thirdApproval = docDto.thirdApproval;

    return this.docRepository.save(newDoc);
  }
}

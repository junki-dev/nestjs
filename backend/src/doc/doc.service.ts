import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Doc } from './doc.entity';
import { ApprovalDocDto } from './dto/approval-doc-dto';
import { CreateDocDto } from './dto/create-doc-dto';

@Injectable()
export class DocService {
  private readonly logger = new Logger(DocService.name);
  constructor(
    @InjectRepository(Doc)
    private readonly docRepository: MongoRepository<Doc>,
  ) {}

  /**
   * INBOX: 내가 결재를 해야 할 문서
   * @param {string} userId 로그인한 사용자 아이디
   * @returns {Doc[]} Document 데이터
   */
  findInbox(userId: string): Promise<Doc[]> {
    this.logger.log(`findInBox() ${userId}`);
    return this.docRepository.find({
      where: {
        $or: [
          { $and: [{ firstApproval: userId }, { firstApprovalYn: null }] },
          { $and: [{ firstApprovalYn: `Y` }, { secondApproval: userId }, { secondApprovalYn: null }] },
          {
            $and: [
              { firstApprovalYn: `Y` },
              { secondApprovalYn: `Y` },
              { thirdApproval: userId },
              { thirdApprovalYn: null },
            ],
          },
        ],
      },
    });
  }

  /**
   * OUTBOX: 내가 생성한 문서 중 결재 진행 중인 문서
   * @param {string} userId 로그인한 사용자 아이디
   * @returns {Doc[]} Document 데이터
   */
  findOutbox(userId: string): Promise<Doc[]> {
    this.logger.log(`findOutbox() ${userId}`);
    return this.docRepository.find({
      where: {
        drafter: userId,
        $or: [
          { firstApprovalYn: null },
          { $and: [{ secondApproval: { $ne: null } }, { secondApprovalYn: null }] },
          { $and: [{ thirdApproval: { $ne: null } }, { thirdApprovalYn: null }] },
        ],
      },
    });
  }

  /**
   * ARCHIVE: 내가 관여한 문서 중 결재가 완료(승인 또는 거절)된 문서
   * @param {string} userId 로그인한 사용자 아이디
   * @returns {Doc[]} Document 데이터
   */
  findArchive(userId: string): Promise<Doc[]> {
    this.logger.log(`findArchive() ${userId}`);
    return this.docRepository.find({
      where: {
        drafter: userId,
        $or: [
          { $and: [{ thirdApproval: { $ne: null } }, { thirdApprovalYn: { $in: [`Y`, `N`] } }] },
          {
            $and: [
              { thirdApproval: null },
              { secondApproval: { $ne: null } },
              { secondApprovalYn: { $in: [`Y`, `N`] } },
            ],
          },
          { $and: [{ thirdApproval: null }, { secondApproval: null }, { firstApprovalYn: { $in: [`Y`, `N`] } }] },
        ],
      },
    });
  }

  /**
   * Document 번호로 Document 데이터 조회
   * @param {number} docNumber Document 번호
   * @returns {Doc} Document 데이터
   */
  findByDocNumber(docNumber: number): Promise<Doc> {
    this.logger.log(`findDocByNumber() ${docNumber}`);
    const stricDocNumber = parseInt(docNumber.toString());
    return this.docRepository.findOne({ docNumber: stricDocNumber });
  }

  /**
   * Document 데이터 전체 조회
   * @returns {Doc[]} Document 데이터
   */
  findAll(): Promise<Doc[]> {
    this.logger.log(`findAll()`);
    return this.docRepository.find();
  }

  /**
   * 마지막 Document 데이터 조회
   * @returns {Doc} Document 데이터
   */
  findLatestDoc(): Promise<Doc> {
    this.logger.log(`findLatestDoc()`);
    return this.docRepository.findOne({ order: { docNumber: 'DESC' } });
  }

  /**
   * Document 생성
   * @param {string} userId 로그인한 사용자 아이디
   * @param {CreateDocDto} docDto Document 등록 DTO
   * @returns {string} result string
   */
  async create(userId: string, docDto: CreateDocDto): Promise<string> {
    try {
      this.logger.log(`create()`);
      const latestDoc = await this.findLatestDoc();

      const newDoc = new Doc();
      newDoc.docNumber = latestDoc ? latestDoc.docNumber + 1 : 1;
      newDoc.title = docDto.title;
      newDoc.type = docDto.type;
      newDoc.content = docDto.content;
      newDoc.drafter = userId;
      newDoc.firstApproval = docDto.firstApproval;
      newDoc.firstApprovalComment = docDto.firstApprovalComment;
      newDoc.firstApprovalYn = docDto.firstApprovalYn;
      newDoc.secondApproval = docDto.secondApproval;
      newDoc.secondApprovalComment = docDto.secondApprovalComment;
      newDoc.secondApprovalYn = docDto.secondApprovalYn;
      newDoc.thirdApproval = docDto.thirdApproval;
      newDoc.thirdApprovalComment = docDto.thirdApprovalComment;
      newDoc.thirdApprovalYn = docDto.thirdApprovalYn;

      await this.docRepository.save(newDoc);
      return `success`;
    } catch (error) {
      return error;
    }
  }

  /**
   *
   * @param {string} userId 로그인한 사용자 아이디
   * @param {ApprovalDocDto} approvalDocDto Document 승인 DTO
   * @returns {string} result string
   */
  async updateApprove(userId: string, approvalDocDto: ApprovalDocDto): Promise<string> {
    try {
      this.logger.log(`updateApprove() approval - ${userId}`);
      const doc: Doc = await this.findByDocNumber(approvalDocDto.docNumber);
      if (!doc) {
        return `cannot find document [${approvalDocDto.docNumber}]`;
      }

      const stricDocNumber = parseInt(approvalDocDto.docNumber.toString());
      if (userId === doc.firstApproval) {
        await this.docRepository.updateOne(
          { docNumber: stricDocNumber },
          {
            $set: { firstApprovalYn: approvalDocDto.approvalYn, firstApprovalComment: approvalDocDto.approvalComment },
          },
        );
      } else if (userId === doc.secondApproval && doc.firstApprovalYn === `Y`) {
        await this.docRepository.updateOne(
          { docNumber: stricDocNumber },
          {
            $set: {
              secondApprovalYn: approvalDocDto.approvalYn,
              secondApprovalComment: approvalDocDto.approvalComment,
            },
          },
        );
      } else if (userId === doc.thirdApproval && doc.firstApprovalYn === `Y` && doc.secondApprovalYn === `Y`) {
        await this.docRepository.updateOne(
          { docNumber: stricDocNumber },
          {
            $set: { thirdApprovalYn: approvalDocDto.approvalYn, thirdApprovalComment: approvalDocDto.approvalComment },
          },
        );
      } else {
        return `failed to approve document [${approvalDocDto.docNumber}]`;
      }

      return `success`;
    } catch (error) {
      return error;
    }
  }
}

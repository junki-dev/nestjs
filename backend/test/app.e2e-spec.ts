import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import { Connection } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as supertest from 'supertest';
import { AppModule } from '../src/app.module';
import { User } from '../src/users/user.entity';
import { Doc } from 'src/doc/doc.entity';

/**
 * E2E 테스트 시나리오
 * 1. user 등록(tester1/tester2/tester3), 등록 된 user 조회
 * 2. 로그인(tester1)
 * 3. Document 등록(결재자1: tester1, 결재자2: tester2, 결재자3: tester3)
 * 4. Inbox(내가 결재를 해야 할 문서) 조회
 * 5. Document 승인(tester1)
 * 6. Outbox(내가 생성한 문서 중 결재 진행 중인 문서) 조회
 * 7. Document 최종 승인(tester2/tester3)
 * 8. Archive(내가 관여한 문서 중 결재가 완료(승인 또는 거절)된 문서) 조회
 */
describe('Document Approval User TEST', () => {
  let app: NestExpressApplication;

  const apiClient = () => {
    return supertest(app.getHttpServer());
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(
          'mongodb://document:document@localhost:27017/document?authSource=admin&authMechanism=SCRAM-SHA-1',
          { dbName: 'test' },
        ),
        AppModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication<NestExpressApplication>();
    await app.listen(3333);
  });

  afterEach(async () => {
    await (app.get(getConnectionToken()) as Connection).db.dropDatabase();
    await app.close();
  });

  test('user1 등록 테스트', async () => {
    await apiClient()
      .post('/users')
      .send({
        id: 'tester1',
        name: 'junki',
        password: '0709',
      })
      .expect(201);
  });

  test('user2 등록 테스트', async () => {
    await apiClient()
      .post('/users')
      .send({
        id: 'tester2',
        name: 'itsub',
        password: '0410',
      })
      .expect(201);
  });

  test('user3 등록 테스트', async () => {
    await apiClient()
      .post('/users')
      .send({
        id: 'tester3',
        name: 'hwang',
        password: '0502',
      })
      .expect(201);
  });

  test('user 데이터 조회 테스트', async () => {
    await apiClient().get('/users').expect(200);
    const users: User[] = (await apiClient().get('/users')).body;
    const saltOrRounds = 10;

    const mockJun = jest.fn();
    const hashJun = await bcrypt.hash('0709', saltOrRounds);
    await bcrypt.compare(hashJun, users[0].password).then((isMatch) => mockJun(isMatch));
    expect(mockJun).toBeCalledWith(expect.anything());
    expect(users[0].id).toBe(`tester1`);
    expect(users[0].name).toBe(`junki`);

    const mockIt = jest.fn();
    const hashIt = await bcrypt.hash('0410', saltOrRounds);
    await bcrypt.compare(hashIt, users[1].password).then((isMatch) => mockIt(isMatch));
    expect(mockIt).toBeCalledWith(expect.anything());
    expect(users[1].id).toBe(`tester2`);
    expect(users[1].name).toBe(`itsub`);

    const mockHwang = jest.fn();
    const hashHwang = await bcrypt.hash('0502', saltOrRounds);
    await bcrypt.compare(hashHwang, users[2].password).then((isMatch) => mockHwang(isMatch));
    expect(mockHwang).toBeCalledWith(expect.anything());
    expect(users[2].id).toBe(`tester3`);
    expect(users[2].name).toBe(`hwang`);
  });

  let accessToken;
  test('로그인 테스트', async () => {
    const response = await apiClient().post('/auth/login').send({
      id: 'tester1',
      password: '0709',
    });

    expect(response.status).toEqual(201);
    expect(response.body).toEqual(expect.anything());
    accessToken = response.body.access_token;
  });

  test(`Document 등록`, async () => {
    await apiClient()
      .post('/doc')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        title: '테스트 제목',
        type: '유형1',
        content: '테스트 내용',
        firstApproval: 'tester1',
        secondApproval: 'tester2',
        thirdApproval: 'tester3',
      })
      .expect(201);
  });

  test(`Inbox(내가 결재를 해야 할 문서) 조회`, async () => {
    const response = await apiClient()
      .get('/doc/outbox')
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(200);

    const docs: Doc[] = response.body;
    expect(docs[0].title).toBe(`테스트 제목`);
    expect(docs[0].type).toBe(`유형1`);
    expect(docs[0].content).toBe(`테스트 내용`);
    expect(docs[0].firstApproval).toBe(`tester1`);
    expect(docs[0].firstApprovalComment).toBe(null);
    expect(docs[0].firstApprovalYn).toBe(null);
    expect(docs[0].secondApproval).toBe(`tester2`);
    expect(docs[0].secondApprovalComment).toBe(null);
    expect(docs[0].secondApprovalYn).toBe(null);
    expect(docs[0].thirdApproval).toBe(`tester3`);
    expect(docs[0].thirdApprovalComment).toBe(null);
    expect(docs[0].thirdApprovalYn).toBe(null);
  });

  test(`Document 승인(tester1)`, async () => {
    await apiClient()
      .post('/doc/approval')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        docNumber: 1,
        approvalYn: 'Y',
        approvalComment: 'tester1 승인합니다.',
      })
      .expect(201);

    const response = await apiClient()
      .get('/doc/number/1')
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(200);

    const doc: Doc = response.body;
    expect(doc.title).toBe(`테스트 제목`);
    expect(doc.type).toBe(`유형1`);
    expect(doc.content).toBe(`테스트 내용`);
    expect(doc.firstApproval).toBe(`tester1`);
    expect(doc.firstApprovalComment).toBe('tester1 승인합니다.');
    expect(doc.firstApprovalYn).toBe('Y');
    expect(doc.secondApproval).toBe(`tester2`);
    expect(doc.secondApprovalComment).toBe(null);
    expect(doc.secondApprovalYn).toBe(null);
    expect(doc.thirdApproval).toBe(`tester3`);
    expect(doc.thirdApprovalComment).toBe(null);
    expect(doc.thirdApprovalYn).toBe(null);
  });

  test(`Outbox(내가 생성한 문서 중 결재 진행 중인 문서) 조회`, async () => {
    const response = await apiClient()
      .get('/doc/outbox')
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(200);

    const docs: Doc[] = response.body;
    expect(docs[0].title).toBe(`테스트 제목`);
    expect(docs[0].type).toBe(`유형1`);
    expect(docs[0].content).toBe(`테스트 내용`);
    expect(docs[0].firstApproval).toBe(`tester1`);
    expect(docs[0].firstApprovalComment).toBe('tester1 승인합니다.');
    expect(docs[0].firstApprovalYn).toBe('Y');
    expect(docs[0].secondApproval).toBe(`tester2`);
    expect(docs[0].secondApprovalComment).toBe(null);
    expect(docs[0].secondApprovalYn).toBe(null);
    expect(docs[0].thirdApproval).toBe(`tester3`);
    expect(docs[0].thirdApprovalComment).toBe(null);
    expect(docs[0].thirdApprovalYn).toBe(null);
  });

  test(`Document 승인(tester2/tester3)`, async () => {
    const tester2Login = await apiClient()
      .post('/auth/login')
      .send({
        id: 'tester2',
        password: '0410',
      })
      .expect(201);

    expect(tester2Login.body).toEqual(expect.anything());
    accessToken = tester2Login.body.access_token;

    await apiClient()
      .post('/doc/approval')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        docNumber: 1,
        approvalYn: 'Y',
        approvalComment: 'tester2 승인합니다.',
      })
      .expect(201);

    const tester3Login = await apiClient()
      .post('/auth/login')
      .send({
        id: 'tester3',
        password: '0502',
      })
      .expect(201);

    expect(tester3Login.body).toEqual(expect.anything());
    accessToken = tester3Login.body.access_token;

    await apiClient()
      .post('/doc/approval')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        docNumber: 1,
        approvalYn: 'Y',
        approvalComment: 'tester3 승인합니다.',
      })
      .expect(201);

    const response = await apiClient()
      .get('/doc/number/1')
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(200);

    const doc: Doc = response.body;
    expect(doc.title).toBe(`테스트 제목`);
    expect(doc.type).toBe(`유형1`);
    expect(doc.content).toBe(`테스트 내용`);
    expect(doc.firstApproval).toBe(`tester1`);
    expect(doc.firstApprovalComment).toBe('tester1 승인합니다.');
    expect(doc.firstApprovalYn).toBe('Y');
    expect(doc.secondApproval).toBe(`tester2`);
    expect(doc.secondApprovalComment).toBe('tester2 승인합니다.');
    expect(doc.secondApprovalYn).toBe(`Y`);
    expect(doc.thirdApproval).toBe(`tester3`);
    expect(doc.thirdApprovalComment).toBe(`tester3 승인합니다.`);
    expect(doc.thirdApprovalYn).toBe(`Y`);
  });

  test(`Archive(내가 관여한 문서 중 결재가 완료(승인 또는 거절)된 문서) 조회`, async () => {
    const tester1Login = await apiClient()
      .post('/auth/login')
      .send({
        id: 'tester1',
        password: '0709',
      })
      .expect(201);

    expect(tester1Login.body).toEqual(expect.anything());
    accessToken = tester1Login.body.access_token;

    const response = await apiClient()
      .get('/doc/archive')
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(200);

    const docs: Doc[] = response.body;
    expect(docs[0].title).toBe(`테스트 제목`);
    expect(docs[0].type).toBe(`유형1`);
    expect(docs[0].content).toBe(`테스트 내용`);
    expect(docs[0].firstApproval).toBe(`tester1`);
    expect(docs[0].firstApprovalComment).toBe('tester1 승인합니다.');
    expect(docs[0].firstApprovalYn).toBe('Y');
    expect(docs[0].secondApproval).toBe(`tester2`);
    expect(docs[0].secondApprovalComment).toBe('tester2 승인합니다.');
    expect(docs[0].secondApprovalYn).toBe(`Y`);
    expect(docs[0].thirdApproval).toBe(`tester3`);
    expect(docs[0].thirdApprovalComment).toBe(`tester3 승인합니다.`);
    expect(docs[0].thirdApprovalYn).toBe(`Y`);
  });
});

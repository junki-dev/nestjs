## 사용기술

- backend
  - Node.js_v16.13(TS)
  - Nest.js_v8.1(Express)
  - yarn_v1.22
- Devops
  - Docker_v20.10.8
  - Docker Compose_v1.25
  - MongoDB_v4.2

## 디렉토리 구조

```bash
└── document-approval
   ├── database     # MongoDB Docker 파일
   ├── backend      #` Backend 소스 코드
   ├── README.md    # 리드미 파일
   └── start.hs     # API 테스트 스크립트
```

## 필수 소프트웨어

- Docker_20.10
- Docker Compose_v1.25
- Node.js_v16.13
- yarn_v1.22

## 테스트 실행 스크립트

```bash
$ ./start.sh
```

## document approval 테스트 시나리오

1. user 등록(tester1/tester2/tester3), 등록 된 user 조회
2. 로그인(tester1)
3. Document 등록(결재자1: tester1, 결재자2: tester2, 결재자3: tester3)
4. Inbox(내가 결재를 해야 할 문서) 조회
5. Document 승인(tester1)
6. Outbox(내가 생성한 문서 중 결재 진행 중인 문서) 조회
7. Document 최종 승인(tester2/tester3)
8. Archive(내가 관여한 문서 중 결재가 완료(승인 또는 거절)된 문서) 조회

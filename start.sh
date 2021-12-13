#!/bin/bash
#************************************************#
# 파일명 : start.sh 
# 작성자 : jkKim
# 설명   : document-approval API 테스트 스크립트
#************************************************#

# 1. 필수 소프트웨어 확인
echo
echo "# 1. 필수 소프트웨어 확인..."
echo

docker version > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo
    echo "# Docker를 설치해주세요."
    echo

    exit 1
fi

docker-compose version > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo
    echo "# Docker Compose를 설치해주세요."
    echo

    exit 1
fi

node -v > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo
    echo "# Node를 설치해주세요."
    echo

    exit 1
fi

yarn -v > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo
    echo "# YARN을 설치해주세요."
    echo

    exit 1
fi

sleep 1

# 2. 패키지 설치
echo
echo "# 2. document approval 패키지 설치 확인..."
echo

if [ ! -d "./backend/node_modules" ]; then
    
    echo
    echo "# 패키지를 설치합니다..."
    echo

    cd backend
    yarn install
    cd ..
fi

sleep 1

# 3. 데이터베이스 실행
echo
echo "# 3. 데이터베이스 실행..."
echo

cd database
docker-compose up -d
cd ..

sleep 1

# 4. backend api 테스트스크립트 실행
echo
echo "# 4. document-approval API E2E 테스트 실행..."
echo

cd backend
yarn test:e2e
cd ..

echo
echo "# document-approval API E2E 테스트 종료..."
echo

sleep 1

# 5. 데이터베이스 종료
echo
echo "# 5. 데이터베이스 종료"
echo

cd database
docker-compose down --volumes --remove-orphans
cd ..

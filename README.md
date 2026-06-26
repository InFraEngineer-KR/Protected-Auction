# 🔨 Protected Auction

> 실시간 경매 및 채팅 기능을 제공하는 웹 서비스

---

## 📌 프로젝트 소개

**Protected Auction**은 사용자가 물품을 등록하고 실시간으로 입찰할 수 있는 경매 플랫폼입니다.  
경매 마감 후 낙찰자와 판매자 간의 채팅방이 자동으로 생성되어 거래를 이어갈 수 있습니다.

---

## 🛠 기술 스택

| 분류 | 기술 |
|------|------|
| Backend | Node.js, Express.js |
| Database | PostgreSQL (Supabase) |
| 실시간 통신 | Socket.io |
| 템플릿 엔진 | EJS |
| 인증 | Express-session |
| 파일 업로드 | Multer |
| 환경변수 | dotenv |

---

## 📁 프로젝트 구조

```
Protected-Auction/
├── app.js                  # 서버 진입점, Socket.io 설정
├── db.js                   # PostgreSQL 연결 설정
├── .env                    # 환경변수 (DB 접속 정보)
├── routes/
│   ├── login_route.js      # 로그인 / 회원가입
│   ├── itemList_route.js   # 경매 목록 / 글쓰기
│   ├── itemDetail_route.js # 경매 상세 / 입찰
│   ├── chat_route.js       # 채팅방
│   ├── mypage_route.js     # 마이페이지
│   ├── myList_route.js     # 내 판매/입찰 내역
│   └── auctionClose_route.js # 경매 마감 처리
├── public/                 # 정적 파일 (HTML, CSS, JS, 이미지)
├── views/                  # EJS 템플릿
└── uploads/                # 업로드된 이미지
```

---

## 🗄 데이터베이스 구조

```
users          - 회원 정보
auction        - 경매 글
bid            - 입찰 내역
chatting       - 채팅방 (경매당 1개)
chattingRoom   - 채팅 메시지
```

---

## ⚙️ 설치 및 실행

### 1. 패키지 설치

```bash
npm install
```

### 2. 환경변수 설정

`.env` 파일을 루트에 생성합니다.

```env
DB_USER=your_db_user
DB_HOST=your_db_host
DB_NAME=postgres
DB_PASSWORD=your_db_password
DB_PORT=5432
```

### 3. 서버 실행

```bash
npm start
```

서버가 실행되면 [http://localhost:3000](http://localhost:3000) 에서 확인할 수 있습니다.

---

## 🔑 주요 기능

### 👤 회원 기능
- 회원가입 / 로그인 / 로그아웃
- 아이디 · 닉네임 중복 확인
- 마이페이지 (프로필 이미지, 닉네임, 전화번호 수정)

### 🏷 경매 기능
- 경매 글 등록 (이미지 업로드 포함)
- 경매 목록 조회 (진행중 / 마감 상태 표시)
- 실시간 입찰 (동시 입찰 방지 처리)
- 경매 자동 마감 (6초마다 체크)

### 💬 채팅 기능
- 경매 마감 시 낙찰자 ↔ 판매자 채팅방 자동 생성
- Socket.io 기반 실시간 채팅
- 입력 중 표시 기능

### 📋 내역 기능
- 내 판매 내역 조회
- 내 입찰 내역 조회

---

## 👨‍💻 개발 정보

- 개발 기간: 2025년 3학년 1학기 웹서버프로그래밍 수업
- 개발 환경: Windows, VS Code
- DB 호스팅: Supabase (PostgreSQL)
const express = require('express');
const router = express.Router();
const db = require('../db');

// dayjs 설정
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
require('dayjs/locale/ko');
dayjs.extend(utc);         // UTC 확장 기능 추가
dayjs.extend(timezone);    // 타임존 처리 기능 추가
dayjs.locale('ko');        // 한국어 로케일 설정

// 1. 전체 채팅 페이지 렌더링
router.get('/room', (req, res) => {
  const user = req.session.user; // 세션에서 로그인 유저 정보 가져오기
  if (!user) return res.redirect('/login'); // 로그인 안 되어 있으면 로그인 페이지로 리다이렉트

  // EJS 템플릿으로 chat.ejs 페이지 렌더링
  res.render('chat', {
    userKey: user.user_key,
    userName: user.display_name
  });
});

// 2. [제거 변경] 전체 채팅방에서는 방 리스트가 필요 없으므로 고정된 단일 방 정보 전달
router.get('/rooms', async (req, res) => {
  const loginUserKey = req.session.user?.user_key;
  if (!loginUserKey) return res.status(401).json({ error: '로그인이 필요합니다.' });

  // 전체 채팅방 하나만 리스트 형식으로 응답 (프론트 UI 유지용)
  res.json([
    { chat_key: 1, title: '📢 광장 전체 채팅방' }
  ]);
});

// 3. [수정] 전체 채팅 메시지 가져오기 (방 번호 무관하게 전체 조회 또는 chat_key = 1 조회)
router.get('/messages/:chat_key', async (req, res) => {
  try {
    // 모든 유저의 전체 채팅 기록을 시간순으로 가져옵니다.
    const result = await db.query(`
      SELECT 
        cr.chat_content, 
        cr.chat_created_at AS send_time, 
        u.display_name,
        u.user_key
      FROM chattingRoom cr
      JOIN users u ON cr.user_key = u.user_key
      ORDER BY cr.chat_created_at ASC
    `);

    // 시간 포맷을 KST 기준으로 변환
    const messages = result.rows.map(row => ({
      chat_content: row.chat_content,
      display_name: row.display_name,
      user_key: row.user_key,
      send_time: dayjs.utc(row.send_time).tz('Asia/Seoul').format('YYYY. M. D. A h:mm:ss')
    }));

    res.json(messages); // 전체 채팅 메시지 목록 반환
  } catch (err) {
    console.error('전체 메시지 조회 실패:', err);
    res.status(500).json({ error: '메시지를 불러오지 못했습니다.' });
  }
});

// 4. [수정] 전체 채팅 메시지 저장
router.post('/save', async (req, res) => {
  const { user_key, chat_content, created_at } = req.body;
  
  // 전체 채팅방은 임의의 공통 키 값 '1'을 할당합니다.
  const DEFAULT_CHAT_KEY = 1; 
  const chat_created_at = created_at || dayjs().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');

  try {
    await db.query(`
      INSERT INTO chattingRoom (chat_key, user_key, chat_content, chat_created_at)
      VALUES ($1, $2, $3, $4)
    `, [DEFAULT_CHAT_KEY, user_key, chat_content, chat_created_at]);

    res.sendStatus(200); // 저장 성공 응답
  } catch (err) {
    console.error('메시지 저장 실패:', err);
    res.status(500).json({ error: '메시지를 저장하지 못했습니다.' });
  }
});

module.exports = router;
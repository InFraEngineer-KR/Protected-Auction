require('dotenv').config();

const express = require('express');
const session = require('express-session');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// ======================
// View Engine
// ======================
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ======================
// Static
// ======================
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// ======================
// Session
// ======================
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60
    }
}));

// ======================
// Body Parser
// ======================
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// ======================
// Routes
// ======================
const loginRoute = require('./routes/login_route');
const chatRoute = require('./routes/chat_route');
const itemDetailRoute = require('./routes/itemDetail_route');
const itemListRoute = require('./routes/itemList_route');
const mypageRoute = require('./routes/mypage_route');
const myListRoute = require('./routes/myList_route');
const auctionCloseRoute = require('./routes/auctionClose_route');

app.use('/', loginRoute);
app.use('/chat', chatRoute);
app.use('/item', itemDetailRoute);
app.use('/items', itemListRoute);
app.use('/mypage', mypageRoute);
app.use('/mylist', myListRoute);
app.use('/auction', auctionCloseRoute);

// ======================
// Socket.io (전체 채팅)
// ======================
io.on('connection', (socket) => {

    console.log('사용자 접속');

    socket.on('chatMessage', ({ userName, message }) => {

        io.emit('chatMessage', {
            userName,
            message
        });

    });

    socket.on('typing', ({ userName }) => {

        socket.broadcast.emit(
            'typing',
            userName
        );

    });

    socket.on('stopTyping', () => {

        socket.broadcast.emit(
            'stopTyping'
        );

    });

    socket.on('disconnect', () => {

        console.log('사용자 종료');

    });

});

// ======================
// Server Start
// ======================
const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// ======================
// 자동 경매 마감 처리
// ======================
setInterval(() => {

    fetch(
        'http://localhost:3000/auction/process-expired-auctions',
        {
            method: 'POST'
        }
    )
        .then(res => res.json())
        .then(json => {
            console.log('[마감처리]', json);
        })
        .catch(err => {
            console.error('❌ 마감 처리 실패:', err);
        });

}, 6000);
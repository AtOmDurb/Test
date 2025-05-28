require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const pool = require('./config/db');


const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  allowedHeaders: ['Authorization', 'Content-Type']
}));
app.use(express.json());

// Подключение роутов
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const teacherRoutes = require('./routes/teacher');
const studentRoutes = require('./routes/student');
const adminRouter = require('./routes/admin');



app.use('/api/admin', adminRouter);
app.use('/api/admin', require('./routes/admin'));
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/student', studentRoutes);

(async () => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    console.log('✅ База данных подключена. Тестовый запрос:', rows[0].result);
  } catch (err) {
    console.error('❌ Ошибка подключения к БД:', err.message);
    process.exit(1);
  }
})();


// 2. Проверка статических файлов
const staticPath = path.join(__dirname, 'public');
if (!fs.existsSync(staticPath)) {
  console.warn('⚠️ Папка public/ отсутствует. Статические файлы не будут обслуживаться');
} else {
  app.use(express.static(staticPath));
  console.log('✅ Статические файлы из public/ доступны');
}

// 3. Основные маршруты
app.get('/', (req, res) => {
  res.send(`
    <h1>Сервер работает</h1>
    <p>Проверьте:</p>
    <ul>
      <li><a href="/api/status">Статус API</a></li>
      <li><a href="/health">Проверка здоровья</a></li>
    </ul>
  `);
});

// 4. Проверка здоровья сервера
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date(),
    uptime: process.uptime(),
    db: pool.pool ? 'connected' : 'disconnected'
  });
});

// 5. Проверка API
app.get('/api/status', (req, res) => {
  res.json({
    message: 'API работает',
    endpoints: {
      auth: '/api/auth/login',
      admin: '/api/admin',
      teacher: '/api/teacher'
    }
  });
});

// 6. Обработка 404
app.use((req, res) => {
  res.status(404).send(`
    <h1>404 Not Found</h1>
    <p>Запрошенный URL ${req.url} не найден</p>
    <a href="/">На главную</a>
  `);
});

// 7. Обработка ошибок
app.use((err, req, res, next) => {
  console.error('⚠️ Ошибка:', err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Ошибка сервера'
  });
});


// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
  🚀 Сервер запущен на порту ${PORT}
  Проверьте работоспособность:
  - Локально: http://localhost:${PORT}
  - Статус API: http://localhost:${PORT}/api/status
  - Проверка здоровья: http://localhost:${PORT}/health
  `);
});
import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ ok: true, service: 'UniChoice API' });
});

function getPort(): number {
  const p = Number(process.env.PORT);
  return Number.isFinite(p) && p > 0 ? p : 5000;
}

function listenOn(port: number, attemptsLeft = 10) {
  const server = http.createServer(app);

  server.once('listening', () => {
    console.log(`✅ Server running on http://localhost:${port}`);
  });

  server.once('error', (err: any) => {
    if (err?.code === 'EADDRINUSE' && attemptsLeft > 0) {
      console.warn(`⚠️  Port ${port} in use. Trying ${port + 1}...`);
      // важно: не переиспользуем server — создаём новый на следующей попытке
      listenOn(port + 1, attemptsLeft - 1);
    } else {
      console.error('❌ Server error:', err);
      process.exit(1);
    }
  });

  server.listen(port);
}

listenOn(getPort());

// Vercel 无服务器函数
import { join } from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const DIST_PATH = join(__dirname, '..', 'dist');

export default function handler(req, res) {
  try {
    // 读取构建后的 index.html
    const htmlPath = join(DIST_PATH, 'index.html');
    const htmlContent = readFileSync(htmlPath, 'utf8');
    
    // 设置响应头并返回内容
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(htmlContent);
  } catch (error) {
    console.error('Error serving HTML:', error);
    res.status(500).send('Internal Server Error');
  }
} 
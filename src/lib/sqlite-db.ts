import Database from 'better-sqlite3';
import path from 'path';

// 数据库文件路径
const dbPath = path.join(process.cwd(), 'data', 'nano-banana.db');

// 确保数据目录存在
import fs from 'fs';
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 创建数据库连接
const db = new Database(dbPath);

// 启用外键约束
db.pragma('foreign_keys = ON');

// 数据库表结构
export interface User {
  id: string;
  email: string;
  name: string;
  credits: number;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Generation {
  id: string;
  user_id: string;
  prompt: string;
  style: string;
  pose: string;
  result_url?: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

// 初始化数据库表
export function initializeDatabase() {
  try {
    // 创建users表
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        credits INTEGER DEFAULT 5,
        avatar_url TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 创建generations表
    db.exec(`
      CREATE TABLE IF NOT EXISTS generations (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        prompt TEXT NOT NULL,
        style TEXT NOT NULL,
        pose TEXT NOT NULL,
        result_url TEXT,
        status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `);

    // 创建索引
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_generations_user_id ON generations(user_id);
      CREATE INDEX IF NOT EXISTS idx_generations_created_at ON generations(created_at);
    `);

    // 插入测试数据
    const insertUser = db.prepare(`
      INSERT OR IGNORE INTO users (id, email, name, credits) 
      VALUES (?, ?, ?, ?)
    `);

    insertUser.run('00000000-0000-0000-0000-000000000001', 'demo@example.com', '演示用户', 10);
    insertUser.run('00000000-0000-0000-0000-000000000002', 'test@example.com', '测试用户', 5);

    console.log('✅ SQLite数据库初始化完成');
    return true;
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error);
    return false;
  }
}

// 用户相关操作
export const userQueries = {
  // 根据邮箱查找用户
  findByEmail: db.prepare('SELECT * FROM users WHERE email = ?'),
  
  // 根据ID查找用户
  findById: db.prepare('SELECT * FROM users WHERE id = ?'),
  
  // 创建用户
  create: db.prepare(`
    INSERT INTO users (id, email, name, credits, avatar_url) 
    VALUES (?, ?, ?, ?, ?)
  `),
  
  // 更新用户积分
  updateCredits: db.prepare('UPDATE users SET credits = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'),
  
  // 更新用户信息
  update: db.prepare(`
    UPDATE users 
    SET name = ?, avatar_url = ?, updated_at = CURRENT_TIMESTAMP 
    WHERE id = ?
  `),
  
  // 删除用户
  delete: db.prepare('DELETE FROM users WHERE id = ?')
};

// 生成记录相关操作
export const generationQueries = {
  // 根据用户ID查找生成记录
  findByUserId: db.prepare('SELECT * FROM generations WHERE user_id = ? ORDER BY created_at DESC'),
  
  // 根据ID查找生成记录
  findById: db.prepare('SELECT * FROM generations WHERE id = ?'),
  
  // 创建生成记录
  create: db.prepare(`
    INSERT INTO generations (id, user_id, prompt, style, pose, result_url, status) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `),
  
  // 更新生成记录状态
  updateStatus: db.prepare(`
    UPDATE generations 
    SET status = ?, result_url = ?, updated_at = CURRENT_TIMESTAMP 
    WHERE id = ?
  `),
  
  // 删除生成记录
  delete: db.prepare('DELETE FROM generations WHERE id = ?')
};

// 初始化数据库
initializeDatabase();

export { db };














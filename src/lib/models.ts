// MongoDB 数据模型定义

export interface User {
  _id?: string
  email: string
  name: string
  password: string
  credits: number
  avatar_url?: string
  created_at: Date
  updated_at: Date
}

export interface Generation {
  _id?: string
  user_id: string
  prompt: string
  style: string
  pose: string
  result_url?: string
  status: 'pending' | 'completed' | 'failed'
  created_at: Date
  updated_at: Date
}

export interface ApiKey {
  _id?: string
  user_id: string
  key: string
  name: string
  is_active: boolean
  created_at: Date
  last_used?: Date
}

export interface ApiLog {
  _id?: string
  user_id?: string
  api_key?: string
  endpoint: string
  method: string
  status_code: number
  response_time: number
  ip_address: string
  user_agent: string
  created_at: Date
}

// 创建索引的辅助函数
export const createIndexes = async (db: any) => {
  try {
    // 用户表索引
    await db.collection('users').createIndex({ email: 1 }, { unique: true })
    await db.collection('users').createIndex({ created_at: -1 })
    
    // 生成记录索引
    await db.collection('generations').createIndex({ user_id: 1 })
    await db.collection('generations').createIndex({ created_at: -1 })
    await db.collection('generations').createIndex({ status: 1 })
    
    // API密钥索引
    await db.collection('api_keys').createIndex({ key: 1 }, { unique: true })
    await db.collection('api_keys').createIndex({ user_id: 1 })
    
    // 日志索引
    await db.collection('logs').createIndex({ created_at: -1 })
    await db.collection('logs').createIndex({ user_id: 1 })
    await db.collection('logs').createIndex({ api_key: 1 })
    
    console.log('✅ MongoDB索引创建成功')
  } catch (error) {
    console.error('❌ 创建索引失败:', error)
  }
}



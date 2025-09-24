import { MongoClient, Db } from 'mongodb'

const uri = process.env.MONGODB_URI || 'mongodb+srv://username:password@cluster.mongodb.net/'
const dbName = process.env.MONGODB_DB || 'nano-banana'

let client: MongoClient
let db: Db

export async function connectToDatabase() {
  if (db) {
    return { client, db }
  }

  try {
    client = new MongoClient(uri)
    await client.connect()
    db = client.db(dbName)
    
    console.log('✅ MongoDB连接成功')
    return { client, db }
  } catch (error) {
    console.error('❌ MongoDB连接失败:', error)
    throw error
  }
}

export async function getDatabase() {
  if (!db) {
    await connectToDatabase()
  }
  return db
}

export async function closeConnection() {
  if (client) {
    await client.close()
    console.log('🔌 MongoDB连接已关闭')
  }
}

// 数据库集合名称
export const COLLECTIONS = {
  USERS: 'users',
  GENERATIONS: 'generations',
  API_KEYS: 'api_keys',
  LOGS: 'logs'
} as const


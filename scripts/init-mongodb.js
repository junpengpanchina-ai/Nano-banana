const { MongoClient } = require('mongodb')
require('dotenv').config({ path: '.env.local' })

const uri = process.env.MONGODB_URI || 'mongodb+srv://username:password@cluster.mongodb.net/'
const dbName = process.env.MONGODB_DB || 'nano-banana'

async function initDatabase() {
  const client = new MongoClient(uri)
  
  try {
    await client.connect()
    console.log('✅ 连接到MongoDB Atlas成功')
    
    const db = client.db(dbName)
    
    // 创建集合和索引
    console.log('📝 创建集合和索引...')
    
    // 用户集合
    await db.createCollection('users')
    await db.collection('users').createIndex({ email: 1 }, { unique: true })
    await db.collection('users').createIndex({ created_at: -1 })
    
    // 生成记录集合
    await db.createCollection('generations')
    await db.collection('generations').createIndex({ user_id: 1 })
    await db.collection('generations').createIndex({ created_at: -1 })
    await db.collection('generations').createIndex({ status: 1 })
    
    // API密钥集合
    await db.createCollection('api_keys')
    await db.collection('api_keys').createIndex({ key: 1 }, { unique: true })
    await db.collection('api_keys').createIndex({ user_id: 1 })
    
    // 日志集合
    await db.createCollection('logs')
    await db.collection('logs').createIndex({ created_at: -1 })
    await db.collection('logs').createIndex({ user_id: 1 })
    await db.collection('logs').createIndex({ api_key: 1 })
    
    console.log('✅ 数据库初始化完成')
    
    // 创建示例数据
    console.log('📊 创建示例数据...')
    
    const sampleUser = {
      email: 'admin@nano-banana.com',
      name: '管理员',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
      credits: 1000,
      created_at: new Date(),
      updated_at: new Date()
    }
    
    await db.collection('users').insertOne(sampleUser)
    console.log('✅ 示例用户创建成功')
    
  } catch (error) {
    console.error('❌ 初始化失败:', error)
  } finally {
    await client.close()
  }
}

initDatabase()



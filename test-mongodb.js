const { MongoClient } = require('mongodb')
require('dotenv').config({ path: '.env.local' })

const uri = process.env.MONGODB_URI || 'mongodb+srv://username:password@cluster.mongodb.net/'
const dbName = process.env.MONGODB_DB || 'nano-banana'

async function testMongoDB() {
  const client = new MongoClient(uri)
  
  try {
    console.log('🔌 连接到MongoDB Atlas...')
    await client.connect()
    console.log('✅ 连接成功!')
    
    const db = client.db(dbName)
    
    // 测试集合
    console.log('📊 测试集合...')
    const collections = await db.listCollections().toArray()
    console.log('现有集合:', collections.map(c => c.name))
    
    // 测试用户集合
    const usersCollection = db.collection('users')
    const userCount = await usersCollection.countDocuments()
    console.log(`用户数量: ${userCount}`)
    
    // 测试插入
    console.log('📝 测试插入数据...')
    const testUser = {
      email: 'test@mongodb.com',
      name: 'MongoDB测试用户',
      password: 'hashed_password',
      credits: 100,
      created_at: new Date(),
      updated_at: new Date()
    }
    
    const result = await usersCollection.insertOne(testUser)
    console.log('✅ 插入成功:', result.insertedId)
    
    // 测试查询
    console.log('🔍 测试查询...')
    const foundUser = await usersCollection.findOne({ email: 'test@mongodb.com' })
    console.log('找到用户:', foundUser ? '是' : '否')
    
    // 清理测试数据
    await usersCollection.deleteOne({ _id: result.insertedId })
    console.log('🧹 清理测试数据完成')
    
    console.log('🎉 MongoDB测试完成!')
    
  } catch (error) {
    console.error('❌ 测试失败:', error)
  } finally {
    await client.close()
    console.log('🔌 连接已关闭')
  }
}

testMongoDB()




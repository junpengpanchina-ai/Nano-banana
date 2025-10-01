import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { connectToDatabase, COLLECTIONS } from './mongodb'
import { User } from './models'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export interface AuthResult {
  success: boolean
  user?: User
  token?: string
  message?: string
}

export async function registerUser(email: string, password: string, name: string): Promise<AuthResult> {
  try {
    const { db } = await connectToDatabase()
    
    // 检查用户是否已存在
    const existingUser = await db.collection(COLLECTIONS.USERS).findOne({ email })
    if (existingUser) {
      return { success: false, message: '用户已存在' }
    }
    
    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // 创建用户
    const user: User = {
      email,
      name,
      password: hashedPassword,
      credits: 100, // 新用户赠送100积分
      created_at: new Date(),
      updated_at: new Date()
    }
    
    const result = await db.collection(COLLECTIONS.USERS).insertOne(user as any)
    user._id = result.insertedId.toString()
    
    // 生成JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )
    
    // 移除密码字段
    const { password: _, ...userWithoutPassword } = user
    
    return {
      success: true,
      user: userWithoutPassword as unknown as User,
      token
    }
  } catch (error) {
    console.error('注册失败:', error)
    return { success: false, message: '注册失败' }
  }
}

export async function loginUser(email: string, password: string): Promise<AuthResult> {
  try {
    const { db } = await connectToDatabase()
    
    // 查找用户
    const user = await db.collection(COLLECTIONS.USERS).findOne({ email })
    if (!user) {
      return { success: false, message: '用户不存在' }
    }
    
    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return { success: false, message: '密码错误' }
    }
    
    // 生成JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )
    
    // 移除密码字段
    const { password: _, ...userWithoutPassword } = user
    
    return {
      success: true,
      user: userWithoutPassword as unknown as User,
      token
    }
  } catch (error) {
    console.error('登录失败:', error)
    return { success: false, message: '登录失败' }
  }
}

export async function verifyToken(token: string): Promise<AuthResult> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string }
    
    const { db } = await connectToDatabase()
    const user = await db.collection(COLLECTIONS.USERS).findOne({ _id: decoded.userId as any })
    
    if (!user) {
      return { success: false, message: '用户不存在' }
    }
    
    // 移除密码字段
    const { password: _, ...userWithoutPassword } = user
    
    return {
      success: true,
      user: userWithoutPassword as unknown as User
    }
  } catch (error) {
    console.error('Token验证失败:', error)
    return { success: false, message: 'Token无效' }
  }
}

export async function getUserById(userId: string): Promise<User | null> {
  try {
    const { db } = await connectToDatabase()
    const user = await db.collection(COLLECTIONS.USERS).findOne({ _id: userId as any })
    
    if (!user) return null
    
    // 移除密码字段
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword as unknown as User
  } catch (error) {
    console.error('获取用户失败:', error)
    return null
  }
}

export async function updateUserCredits(userId: string, credits: number): Promise<boolean> {
  try {
    const { db } = await connectToDatabase()
    await db.collection(COLLECTIONS.USERS).updateOne(
      { _id: userId as any },
      { 
        $set: { 
          credits,
          updated_at: new Date()
        }
      }
    )
    return true
  } catch (error) {
    console.error('更新积分失败:', error)
    return false
  }
}

export async function incrementUserCredits(userId: string, delta: number): Promise<boolean> {
  try {
    const { db } = await connectToDatabase()
    await db.collection(COLLECTIONS.USERS).updateOne(
      { _id: userId as any },
      { 
        $inc: { credits: delta },
        $set: { updated_at: new Date() }
      }
    )
    return true
  } catch (error) {
    console.error('增量更新积分失败:', error)
    return false
  }
}

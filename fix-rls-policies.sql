-- 修复 Supabase RLS 策略
-- 在 Supabase Dashboard 的 SQL 编辑器中运行此脚本

-- 删除现有的策略（如果存在）
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can view own generations" ON generations;
DROP POLICY IF EXISTS "Users can insert own generations" ON generations;
DROP POLICY IF EXISTS "Users can update own generations" ON generations;

-- 重新创建更完善的 RLS 策略

-- Users 表的策略
CREATE POLICY "Enable read access for all users" ON users
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users based on user_id" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Generations 表的策略
CREATE POLICY "Enable read access for all users" ON generations
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON generations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id" ON generations
  FOR UPDATE USING (auth.uid() = user_id);

-- 允许服务角色完全访问（用于管理操作）
CREATE POLICY "Enable all access for service role" ON users
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Enable all access for service role" ON generations
  FOR ALL USING (auth.role() = 'service_role');

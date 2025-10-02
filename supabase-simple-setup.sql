-- 简化的 Supabase 表创建脚本
-- 请在 Supabase Dashboard 的 SQL Editor 中执行

-- 1. 创建 payments 表
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider TEXT NOT NULL,
  user_id TEXT NOT NULL,
  amount_cents INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 创建 ledger 表
CREATE TABLE ledger (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  delta INTEGER NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 创建索引
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_ledger_user_id ON ledger(user_id);

-- 4. 启用 RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ledger ENABLE ROW LEVEL SECURITY;

-- 5. 创建 RLS 策略
CREATE POLICY "Service role can access all payments" ON payments
    FOR ALL USING (true);

CREATE POLICY "Service role can access all ledger" ON ledger
    FOR ALL USING (true);


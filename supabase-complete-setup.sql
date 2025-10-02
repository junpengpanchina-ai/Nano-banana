-- 完整的 Supabase 表创建脚本
-- 请在 Supabase Dashboard 的 SQL Editor 中执行

-- 删除现有表（如果存在）
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS ledger CASCADE;

-- 1. 创建 payments 表（完整结构）
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider TEXT NOT NULL,
  provider_order_id TEXT,
  identifier TEXT UNIQUE,
  user_id TEXT NOT NULL,
  amount_cents INTEGER NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'refunded', 'failed')),
  raw JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 创建 ledger 表（完整结构）
CREATE TABLE ledger (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  delta INTEGER NOT NULL,
  reason TEXT NOT NULL,
  source TEXT DEFAULT 'webhook' CHECK (source IN ('webhook', 'admin', 'system')),
  ref TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 创建索引
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_identifier ON payments(identifier);
CREATE INDEX idx_payments_created_at ON payments(created_at);
CREATE INDEX idx_ledger_user_id ON ledger(user_id);
CREATE INDEX idx_ledger_created_at ON ledger(created_at);

-- 4. 创建 updated_at 触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. 为 payments 表添加触发器
CREATE TRIGGER update_payments_updated_at 
    BEFORE UPDATE ON payments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 6. 启用 RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ledger ENABLE ROW LEVEL SECURITY;

-- 7. 创建 RLS 策略
CREATE POLICY "Service role can access all payments" ON payments
    FOR ALL USING (true);

CREATE POLICY "Service role can access all ledger" ON ledger
    FOR ALL USING (true);


"use client";

import { useEffect, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type User = {
  id: string
  email: string
  name: string
  credits: number
  status?: 'active' | 'suspended' | 'deleted'
  created_at: string
  updated_at: string
}

export default function AdminUsersPage() {
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [items, setItems] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [keySet, setKeySet] = useState(false);
  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

  useEffect(() => {
    if (!keySet) return;
    const controller = new AbortController();
    const run = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/users?q=${encodeURIComponent(q)}&page=${page}&pageSize=${pageSize}`, {
          headers: adminKey ? { 'x-admin-key': adminKey } : undefined,
          signal: controller.signal,
        });
        const json = await res.json();
        if (json.success) {
          setItems(json.data || []);
          setTotal(json.total || 0);
        } else {
          console.error(json.error);
        }
      } catch (e) {
        if ((e as any).name !== 'AbortError') console.error(e);
      } finally {
        setLoading(false);
      }
    };
    run();
    return () => controller.abort();
  }, [q, page, pageSize, keySet, adminKey]);

  const updateUser = async (userId: string, updates: Partial<Pick<User, 'credits' | 'status' | 'name'>>) => {
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        ...(adminKey ? { 'x-admin-key': adminKey } : {}),
      },
      body: JSON.stringify({ userId, ...updates }),
    });
    const json = await res.json();
    if (json.success) {
      setItems(prev => prev.map(u => (u.id === userId ? json.data : u)));
    } else {
      alert(json.error || '更新失败');
    }
  };

  if (!keySet) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Admin Access</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Admin Key</label>
                <Input value={adminKey} onChange={(e) => setAdminKey(e.target.value)} placeholder="Enter ADMIN_KEY" />
              </div>
              <Button onClick={() => setKeySet(true)} disabled={!adminKey}>Continue</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Input placeholder="搜索邮箱或姓名" value={q} onChange={(e) => { setPage(1); setQ(e.target.value); }} />
        <Button variant="outline" onClick={() => { setQ(''); setPage(1); }}>重置</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>用户管理</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="p-2">邮箱</th>
                  <th className="p-2">姓名</th>
                  <th className="p-2">积分</th>
                  <th className="p-2">状态</th>
                  <th className="p-2">创建时间</th>
                  <th className="p-2">操作</th>
                </tr>
              </thead>
              <tbody>
                {items.map(u => (
                  <tr key={u.id} className="border-b">
                    <td className="p-2">{u.email}</td>
                    <td className="p-2">
                      <Input defaultValue={u.name} onBlur={(e) => updateUser(u.id, { name: e.target.value })} />
                    </td>
                    <td className="p-2">
                      <Input type="number" defaultValue={u.credits} onBlur={(e) => updateUser(u.id, { credits: Number(e.target.value) })} />
                    </td>
                    <td className="p-2">{u.status || 'active'}</td>
                    <td className="p-2">{new Date(u.created_at).toLocaleString()}</td>
                    <td className="p-2 flex gap-2">
                      {u.status === 'suspended' ? (
                        <Button variant="secondary" onClick={() => updateUser(u.id, { status: 'active' })}>解封</Button>
                      ) : (
                        <Button variant="destructive" onClick={() => updateUser(u.id, { status: 'suspended' })}>封禁</Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div>{loading ? '加载中...' : `共 ${total} 条，${page}/${totalPages}`}</div>
            <div className="flex gap-2">
              <Button variant="outline" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>上一页</Button>
              <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>下一页</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



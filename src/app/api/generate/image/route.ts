import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const file = form.get("file") as File | null;
    const options = form.get("options");

    if (!file) {
      return NextResponse.json({ error: "缺少文件" }, { status: 400 });
    }

    // 这里应调用真实AI服务。为了演示，返回一个可用的占位图地址
    const result = {
      id: Math.random().toString(36).slice(2),
      url: `https://picsum.photos/seed/${Date.now()}/512/512`,
      thumbnailUrl: `https://picsum.photos/seed/${Date.now() + 1}/400/400`,
      name: file.name,
      size: file.size,
      type: file.type,
      options,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(result);
  } catch (e) {
    console.error("image generate error", e);
    return NextResponse.json({ error: "生成失败" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "image generate api ok" });
}




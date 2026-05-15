import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  await prisma.product.findFirst({ select: { id: true } });
  return NextResponse.json({ ok: true, ts: new Date().toISOString() });
}

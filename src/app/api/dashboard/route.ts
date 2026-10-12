import { NextResponse } from 'next/server';
import { getDashboardData } from '@/src/lib/api/dashboard';

export async function GET() {
  try {
    const data = await getDashboardData();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getPayouts, approvePayout } from '@/src/lib/api/payouts';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const payouts = await getPayouts({ search });
    return NextResponse.json({ success: true, data: payouts });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payouts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Payout ID required' }, { status: 400 });
    }
    const approved = await approvePayout(id);
    return NextResponse.json({ success: true, data: approved });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to approve payout' },
      { status: 500 }
    );
  }
}

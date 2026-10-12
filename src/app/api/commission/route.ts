import { NextRequest, NextResponse } from 'next/server';
import {
  getCommissionData,
  updateCommissionDefaults,
  updateCommissionOverride,
  addCommissionOverride,
} from '@/src/lib/api/commission';

export async function GET() {
  try {
    const data = await getCommissionData();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch commission data' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    if (body.defaults) {
      const updated = await updateCommissionDefaults(body.defaults);
      return NextResponse.json({ success: true, data: updated });
    }
    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update commission defaults' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { partner, category, rate } = body;
    if (!partner || !category || rate === undefined) {
      return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
    }
    const newOverride = await addCommissionOverride(partner, category, Number(rate));
    return NextResponse.json({ success: true, data: newOverride });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to add override' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, rate } = body;
    if (!id || rate === undefined) {
      return NextResponse.json({ success: false, error: 'Missing id or rate' }, { status: 400 });
    }
    const updated = await updateCommissionOverride(id, Number(rate));
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update override' },
      { status: 500 }
    );
  }
}

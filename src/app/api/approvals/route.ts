import { NextRequest, NextResponse } from 'next/server';
import {
  getApprovals,
  approveListing,
  rejectListing,
  undoApproval,
  approveAllListings,
} from '@/src/lib/api/approvals';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;

    const data = await getApprovals({ category, search });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch approvals' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, id } = body;

    if (action === 'approve-all') {
      const result = await approveAllListings();
      return NextResponse.json({ success: true, data: result });
    }

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });
    }

    if (action === 'approve') {
      const result = await approveListing(id);
      return NextResponse.json({ success: true, data: result });
    } else if (action === 'reject') {
      const result = await rejectListing(id);
      return NextResponse.json({ success: true, data: result });
    } else if (action === 'undo') {
      const result = await undoApproval(id);
      return NextResponse.json({ success: true, data: result });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to process approval action' },
      { status: 500 }
    );
  }
}

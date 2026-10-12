import { NextRequest, NextResponse } from 'next/server';
import { getUsers, addUser, toggleUserStatus, updateUser } from '@/src/lib/api/users';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = (searchParams.get('role') as 'Provider' | 'Partner') || undefined;
    const search = searchParams.get('search') || undefined;

    const users = await getUsers({ role, search });
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newUser = await addUser(body);
    return NextResponse.json({ success: true, data: newUser });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, action, ...updates } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });
    }

    if (action === 'toggle-status') {
      const updated = await toggleUserStatus(id);
      return NextResponse.json({ success: true, data: updated });
    }

    const updated = await updateUser(id, updates);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

import { NextResponse, NextRequest } from 'next/server';
import { verifyToken } from '../../../lib/auth';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const payload: any = verifyToken(token);
  if (!payload) {
    return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
  }

  // Enforce role-based access (e.g., only superadmin)
  if (payload.role !== 'superadmin') {
    return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
  }

  return NextResponse.json({ success: true, data: 'Protected data for superadmin' });
}

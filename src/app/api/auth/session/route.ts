import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import type { AuthSession } from '@/shared/types/auth';

// Session storage (same as in login route)
const globalStore = globalThis as unknown as {
  __sessions?: Map<string, AuthSession>;
};
const sessions = globalStore.__sessions || new Map<string, AuthSession>();

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session_id')?.value;

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'No session' },
        { status: 401 }
      );
    }

    const session = sessions.get(sessionId);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Invalid session' },
        { status: 401 }
      );
    }

    // Check if session expired
    if (new Date() > new Date(session.expiresAt)) {
      sessions.delete(sessionId);
      return NextResponse.json(
        { success: false, error: 'Session expired' },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true, session });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to get session' },
      { status: 500 }
    );
  }
}

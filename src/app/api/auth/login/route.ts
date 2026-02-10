import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import type { AuthSession, LoginResponse } from '@/shared/types/auth';
import { StaffUser } from '@/shared/types/order';

// In-memory user storage for demo (would be database in production)
interface User {
  id: string;
  email: string;
  password: string; // In production, this would be hashed
  role: 'superadmin' | 'admin' | 'manager' | 'staff';
  organizationId?: string;
  name: string;
}

const users: User[] = [
  {
    id: 'superadmin-1',
    email: 'superadmin@orderbyte.com',
    password: 'admin123',
    role: 'superadmin',
    name: 'Super Admin',
  },
  {
    id: 'staff-1',
    email: 'manager@bellavista.com',
    password: 'staff123',
    role: 'manager',
    organizationId: 'bella-vista',
    name: 'John Manager',
  },
  {
    id: 'staff-2',
    email: 'admin@urbancafe.com',
    password: 'staff123',
    role: 'admin',
    organizationId: 'urban-cafe',
    name: 'Sarah Admin',
  },
];

// Session storage (use globalThis for persistence)
const globalStore = globalThis as unknown as {
  __sessions?: Map<string, AuthSession>;
};

if (!globalStore.__sessions) {
  globalStore.__sessions = new Map<string, AuthSession>();
}
const sessions = globalStore.__sessions;

function generateSessionId(): string {
  return `sess-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function createSession(user: User): AuthSession {
  const session: AuthSession = {
    userId: user.id,
    email: user.email,
    role: user.role,
    organizationId: user.organizationId,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  };
  return session;
}

// POST /api/auth/login - Login user
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      email: string;
      password: string;
      organizationId?: string;
    };
    const { email, password, organizationId } = body;

    // Find user
    const user = users.find(
      (u) =>
        u.email === email &&
        u.password === password &&
        (!organizationId || u.organizationId === organizationId)
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create session
    const session = createSession(user);
    const sessionId = generateSessionId();
    sessions.set(sessionId, session);

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set('session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    });

    const response: LoginResponse = {
      success: true,
      session,
    };

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}

// GET /api/auth/session - Get current session
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

// DELETE /api/auth/logout - Logout user
export async function DELETE() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session_id')?.value;

    if (sessionId) {
      sessions.delete(sessionId);
    }

    cookieStore.delete('session_id');

    return NextResponse.json({ success: true, message: 'Logged out' });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    );
  }
}

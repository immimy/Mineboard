import { NextRequest } from 'next/server';
import { updateSession } from '@/utils/database/proxy';
import { mockGetClaims } from '@/mocks/node/supabase/ssr';

vi.mock('@supabase/ssr', () => import('@/mocks/node/supabase/ssr'));

// Helper to build a NextRequest for a given path
function buildRequest(pathname: string): NextRequest {
  return new NextRequest(new URL(`http://localhost:3000${pathname}`));
}

const PUBLIC_ROUTES = ['/', '/about', '/product'];

describe('Proxy — User is NOT authenticated', () => {
  beforeEach(() => {
    // Set unauthenticated user
    mockGetClaims.mockResolvedValue({ data: { claims: null } });
  });

  it('redirects to / when accessing a protected route', async () => {
    const request = buildRequest('/dashboard');
    const response = await updateSession(request, PUBLIC_ROUTES);

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('http://localhost:3000/');
  });

  it('redirects to / when accessing a deeply nested protected route', async () => {
    const request = buildRequest('/dashboard/settings/profile');
    const response = await updateSession(request, PUBLIC_ROUTES);

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('http://localhost:3000/');
  });

  it('allows access to / (public route)', async () => {
    const request = buildRequest('/');
    const response = await updateSession(request, PUBLIC_ROUTES);

    expect(response.status).not.toBe(307);
  });

  it('allows access to /about (public route)', async () => {
    const request = buildRequest('/about');
    const response = await updateSession(request, PUBLIC_ROUTES);

    expect(response.status).not.toBe(307);
  });

  it('allows access to /about/team (public sub-path)', async () => {
    const request = buildRequest('/about/team');
    const response = await updateSession(request, PUBLIC_ROUTES);

    expect(response.status).not.toBe(307);
  });
});

describe('Proxy — User IS authenticated', () => {
  const mockClaims = { sub: 'user-123', email: 'test@example.com' };

  beforeEach(() => {
    // Set authenticated user
    mockGetClaims.mockResolvedValue({ data: { claims: mockClaims } });
  });

  it('redirects to /dashboard when accessing /', async () => {
    const request = buildRequest('/');
    const response = await updateSession(request, PUBLIC_ROUTES);

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(
      'http://localhost:3000/dashboard',
    );
  });

  it('allows access to /dashboard', async () => {
    const request = buildRequest('/dashboard');
    const response = await updateSession(request, PUBLIC_ROUTES);

    expect(response.status).not.toBe(307);
  });

  it('allows access to a protected nested route', async () => {
    const request = buildRequest('/dashboard/settings');
    const response = await updateSession(request, PUBLIC_ROUTES);

    expect(response.status).not.toBe(307);
  });
});

describe('Proxy — route matcher work correctly (/product as public)', () => {
  beforeEach(() => {
    // Set unauthenticated user
    mockGetClaims.mockResolvedValue({ data: { claims: null } });
  });

  it('redirects to / when accessing /products', async () => {
    const request = buildRequest('/products');
    const response = await updateSession(request, PUBLIC_ROUTES);

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('http://localhost:3000/');
  });

  it('redirects to / when accessing /products/about/product-id', async () => {
    const request = buildRequest('/products/about/product-id');
    const response = await updateSession(request, PUBLIC_ROUTES);

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('http://localhost:3000/');
  });
});

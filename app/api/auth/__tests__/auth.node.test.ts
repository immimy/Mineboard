import { GET } from '@/app/api/auth/route';
import { mockExchangeCodeForSession } from '@/mocks/node/supabase/serverClient';

const mock = {
  origin: 'http://localhost:3000',
};

// Helper to build a Request for a given url
function buildRequest(url: string, headers?: Record<string, string>): Request {
  return new Request(url, { headers });
}

describe('GET /api/auth', () => {
  describe('No code in params', () => {
    it('redirects to homepage with error', async () => {
      const request = buildRequest(`${mock.origin}/api/auth`);
      const response = await GET(request);

      const expectedLocation = new URL(
        `${mock.origin}/?error=Auth callback failed`,
      ).href;

      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toBe(expectedLocation);
    });
  });

  describe('Fails to exchange code for a session', () => {
    it('redirects to homepage with error', async () => {
      vi.mocked(mockExchangeCodeForSession).mockResolvedValue({
        error: { message: 'Invalid code' },
      });

      const request = buildRequest(`${mock.origin}/api/auth?code=bad-code`);
      const response = await GET(request);

      const expectedLocation = new URL(
        `${mock.origin}/?error=Auth callback failed`,
      ).href;

      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toBe(expectedLocation);
    });
  });

  describe('Succeed to exchange code for a session', () => {
    beforeEach(() => {
      vi.mocked(mockExchangeCodeForSession).mockResolvedValue({
        error: null,
      });
    });
    afterEach(() => {
      vi.unstubAllEnvs();
    });

    it('redirects to / by default in local env', async () => {
      vi.stubEnv('NODE_ENV', 'development');

      const request = buildRequest(`${mock.origin}/api/auth?code=valid-code`);
      const response = await GET(request);

      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toBe(`${mock.origin}/`);
    });

    it('redirects to ?next= path in local env', async () => {
      vi.stubEnv('NODE_ENV', 'development');

      const request = buildRequest(
        `${mock.origin}/api/auth?code=valid-code&next=/dashboard`,
      );
      const response = await GET(request);

      expect(response.headers.get('location')).toBe(`${mock.origin}/dashboard`);
    });

    it('ignores non-relative next param and redirects to /', async () => {
      vi.stubEnv('NODE_ENV', 'development');

      const request = buildRequest(
        `${mock.origin}/api/auth?code=valid-code&next=https://evil.com`,
      );
      const response = await GET(request);

      expect(response.headers.get('location')).toBe(`${mock.origin}/`);
    });

    it('uses x-forwarded-host in production', async () => {
      vi.stubEnv('NODE_ENV', 'production');

      const request = buildRequest(`${mock.origin}/api/auth?code=valid-code`, {
        'x-forwarded-host': 'myapp.com',
      });
      const response = await GET(request);

      expect(response.headers.get('location')).toBe('https://myapp.com/');
    });

    it('falls back to origin when no x-forwarded-host in production', async () => {
      vi.stubEnv('NODE_ENV', 'production');

      const request = buildRequest(`${mock.origin}/api/auth?code=valid-code`);
      const response = await GET(request);

      expect(response.headers.get('location')).toBe(`${mock.origin}/`);
    });
  });
});

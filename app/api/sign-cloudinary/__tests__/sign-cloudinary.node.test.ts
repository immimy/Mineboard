import { POST } from '@/app/api/sign-cloudinary/route';
import { getCloudinaryServerClient } from '@/utils/cloudinary/server';
import { mockGetClaims } from '@/mocks/node/supabase/serverClient';

vi.mock('@/utils/cloudinary/server', () => ({
  getCloudinaryServerClient: vi.fn(),
}));

const mockSignRequest = vi.fn();

function buildRequest(paramsToSign: unknown) {
  return new Request('http://localhost:3000/api/sign-cloudinary', {
    method: 'POST',
    body: JSON.stringify({ paramsToSign }),
  });
}

describe('POST /api/sign-cloudinary', () => {
  beforeEach(() => {
    vi.stubEnv('CLOUDINARY_API_SECRET', 'test-secret');
    vi.stubEnv('NEXT_PUBLIC_VERCEL_ENV', 'development');
    vi.mocked(getCloudinaryServerClient).mockReturnValue({
      utils: { api_sign_request: mockSignRequest },
    } as never);
    mockSignRequest.mockReturnValue('signed-request');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('rejects unauthenticated cleanup upload requests', async () => {
    mockGetClaims.mockResolvedValue({ data: { claims: null } });

    const response = await POST(buildRequest({}) as never);

    expect(response.status).toBe(401);
    expect(mockSignRequest).not.toHaveBeenCalled();
  });

  it('rejects a mismatched owner', async () => {
    mockGetClaims.mockResolvedValue({
      data: { claims: { sub: 'owner-id' } },
    });

    const response = await POST(
      buildRequest({
        context: 'owner_id=another-user',
        upload_preset: 'mineboard_app_dev',
      }) as never,
    );

    expect(response.status).toBe(403);
    expect(mockSignRequest).not.toHaveBeenCalled();
  });

  it('rejects a mismatched upload preset', async () => {
    mockGetClaims.mockResolvedValue({
      data: { claims: { sub: 'owner-id' } },
    });

    const response = await POST(
      buildRequest({
        context: 'owner_id=owner-id',
        upload_preset: 'not-allowed-preset',
      }) as never,
    );

    expect(response.status).toBe(403);
    expect(mockSignRequest).not.toHaveBeenCalled();
  });

  it('signs only the authenticated user’s allowed upload parameters', async () => {
    mockGetClaims.mockResolvedValue({
      data: { claims: { sub: 'owner-id' } },
    });
    const params = {
      context: 'caption=board-image|owner_id=owner-id',
      upload_preset: 'mineboard_app_dev',
      timestamp: 123,
    };

    const response = await POST(buildRequest(params) as never);

    await expect(response.json()).resolves.toEqual({
      signature: 'signed-request',
    });
    expect(mockSignRequest).toHaveBeenCalledWith(params, 'test-secret');
  });
});

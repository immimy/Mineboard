import { imageCleanup } from '@/utils/actions/imageCleanup';
import { getCloudinaryServerClient } from '@/utils/cloudinary/server';
import { mockGetUser, mockRpc } from '@/mocks/node/supabase/serverClient';

vi.mock('@/utils/cloudinary/server', () => ({
  getCloudinaryServerClient: vi.fn(),
}));

const mockResourcesByIds = vi.fn();
const mockRemoveTag = vi.fn();
const mockDeleteResources = vi.fn();

const cloudinary = {
  api: {
    resources_by_ids: mockResourcesByIds,
    delete_resources: mockDeleteResources,
  },
  uploader: {
    remove_tag: mockRemoveTag,
  },
};

const ownerId = 'owner-id';

describe('imageCleanup', () => {
  beforeEach(() => {
    vi.mocked(getCloudinaryServerClient).mockReturnValue(cloudinary as never);
    mockGetUser.mockResolvedValue({ data: { user: { id: ownerId } } });
    mockRpc.mockResolvedValue({ data: [], error: null });
  });

  it('does not mutate Cloudinary when no authenticated user is available', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    await expect(
      imageCleanup({ case: 'cancelled', discardedIds: ['orphan-image'] }),
    ).rejects.toEqual(new Error('NEXT_REDIRECT: /'));

    expect(mockResourcesByIds).not.toHaveBeenCalled();
    expect(mockRemoveTag).not.toHaveBeenCalled();
    expect(mockDeleteResources).not.toHaveBeenCalled();
  });

  it('mutates only assets owned by the authenticated user', async () => {
    mockResourcesByIds.mockResolvedValue({
      resources: [
        {
          public_id: 'saved-image',
          context: { custom: { owner_id: ownerId } },
        },
        {
          public_id: 'other-user-image',
          context: { custom: { owner_id: 'another-user' } },
        },
        {
          public_id: 'discarded-image',
          context: { custom: { owner_id: ownerId } },
        },
      ],
    });

    await expect(
      imageCleanup({
        case: 'saved',
        savedIds: ['saved-image', 'other-user-image'],
        discardedIds: ['discarded-image'],
      }),
    ).resolves.toEqual({ error: null });

    expect(mockRemoveTag).toHaveBeenCalledWith('unsaved', ['saved-image']);
    expect(mockDeleteResources).toHaveBeenCalledWith(['discarded-image'], {
      resource_type: 'image',
      type: 'upload',
    });
  });

  it('repairs referenced cancelled uploads and deletes only unreferenced uploads', async () => {
    mockResourcesByIds.mockResolvedValue({
      resources: ['referenced-image', 'orphan-image'].map((public_id) => ({
        public_id,
        context: { custom: { owner_id: ownerId } },
      })),
    });
    mockRpc.mockResolvedValue({
      data: [{ public_id: 'referenced-image' }],
      error: null,
    });

    await imageCleanup({
      case: 'cancelled',
      discardedIds: ['referenced-image', 'orphan-image'],
    });

    expect(mockRpc).toHaveBeenCalledWith('get_referenced_image_public_ids', {
      p_public_ids: ['referenced-image', 'orphan-image'],
    });
    expect(mockRemoveTag).toHaveBeenCalledWith('unsaved', ['referenced-image']);
    expect(mockDeleteResources).toHaveBeenCalledWith(['orphan-image'], {
      resource_type: 'image',
      type: 'upload',
    });
  });

  it('fails closed when the cancelled-upload reference lookup fails', async () => {
    mockResourcesByIds.mockResolvedValue({
      resources: [
        {
          public_id: 'orphan-image',
          context: { custom: { owner_id: ownerId } },
        },
      ],
    });
    mockRpc.mockResolvedValue({
      data: null,
      error: { message: '**Test Error**: Database unavailable' },
    });

    await expect(
      imageCleanup({ case: 'cancelled', discardedIds: ['orphan-image'] }),
    ).resolves.toEqual({ error: null });

    expect(mockRemoveTag).not.toHaveBeenCalled();
    expect(mockDeleteResources).not.toHaveBeenCalled();
  });
});

export const mockUser = {
  id: 'user-id',
  email: 'test@example.com',
  user_metadata: {
    avatar_url: 'https://ui-avatars.com/api/?name=Mock+User',
  },
};

export const mockGetUser = vi.fn();

export const createClient = vi.fn(() => {
  return {
    auth: {
      getUser: mockGetUser,
    },
  };
});

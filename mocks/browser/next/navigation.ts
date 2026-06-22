export const redirect = vi.fn();

export const useSearchParams = vi.fn(() => {
  return {
    get: vi.fn(),
  };
});

export const mockReplace = vi.fn();
export const useRouter = vi.fn(() => {
  return {
    replace: mockReplace,
  };
});

export const useParams = vi.fn();

export const usePathname = vi.fn();

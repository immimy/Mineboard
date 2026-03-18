import { render } from 'vitest-browser-react';
import ErrorToast from '../ErrorToast';
import { toast } from '@/mocks/browser/react-toastify/toast';
import { useSearchParams } from '@/mocks/browser/next/navigation';

// ---------------------------------------------------------------------------
// toast function is invoked correctly
// ---------------------------------------------------------------------------

describe('toast function is invoked correctly', () => {
  beforeEach(() => {
    useSearchParams.mockReset();
  });

  it('renders null — no visible DOM element', async () => {
    const { container } = await render(<ErrorToast />);

    expect(container.firstChild).toBeNull();
  });

  it('calls toast.error with the error message when error param is present', async () => {
    vi.mocked(useSearchParams).mockReturnValue({
      get: vi.fn().mockReturnValue('Auth callback failed'),
    } as any);

    await render(<ErrorToast />);

    expect(toast.error).toHaveBeenCalledWith('Auth callback failed');
    expect(toast.error).toHaveBeenCalledTimes(1);
  });

  it('does not call toast.error when no error param is present', async () => {
    vi.mocked(useSearchParams).mockReturnValue({
      get: vi.fn().mockReturnValue(null),
    } as any);

    await render(<ErrorToast />);

    expect(toast.error).not.toHaveBeenCalled();
  });

  it('does not call toast.error when error param is an empty string', async () => {
    vi.mocked(useSearchParams).mockReturnValue({
      get: vi.fn().mockReturnValue(''),
    });

    await render(<ErrorToast />);

    expect(toast.error).not.toHaveBeenCalled();
  });
});

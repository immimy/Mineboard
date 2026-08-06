import AppContextProvider, {
  useAppContext,
} from '@/components/global/AppContext';
import { MockedProvider } from '@apollo/client/testing/react';
import { render } from 'vitest-browser-react';
import DemoWorkspace from '../DemoWorkspace';
import { demoHomepageQuery } from './demo.mock';

function OpenSidebarButton() {
  const { openSidebar } = useAppContext();

  return (
    <button type='button' onClick={openSidebar}>
      Open demo sidebar
    </button>
  );
}

type RenderDemoHomepageOptions = {
  withSidebarTrigger?: boolean;
};

export function renderDemoHomepage({
  withSidebarTrigger = false,
}: RenderDemoHomepageOptions = {}) {
  return render(
    <MockedProvider>
      <AppContextProvider>
        {withSidebarTrigger && <OpenSidebarButton />}
        <DemoWorkspace query={demoHomepageQuery} />
      </AppContextProvider>
    </MockedProvider>,
  );
}

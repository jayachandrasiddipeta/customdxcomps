/* eslint-disable react/jsx-no-useless-fragment */
import type { Meta, StoryObj } from '@storybook/react';

import TmhccDxLibraryClaimForm from './index';

import { configProps } from './mock';
import { mockGetDataAsync, mockGetPageDataAsync } from './mockListValues';
import localizations from './localizations.json';

const meta: Meta<typeof TmhccDxLibraryClaimForm> = {
  title: 'TmhccDxLibraryClaimForm',
  component: TmhccDxLibraryClaimForm,
  excludeStories: /.*Data$/,
  parameters: {
    layout: 'fullscreen'
  }
};

export default meta;
type Story = StoryObj<typeof TmhccDxLibraryClaimForm>;

if (!(window as any).PCore) {
  (window as any).PCore = {} as any;
}

if (!(window as any).PCore.getRestClient) {
  (window as any).PCore.getRestClient = () => ({
    invokeCustomRestApi: async (path: string) => {
      if (typeof path === 'string' && path.includes('/attachments/upload')) {
        return { data: { ID: `ATT-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` } };
      }
      return { data: { ID: 'CLM-1234' } };
    }
  });
}

if (!(window as any).PCore.getDataPageUtils) {
  (window as any).PCore.getDataPageUtils = () => ({
    getDataAsync: mockGetDataAsync,
    getPageDataAsync: mockGetPageDataAsync
  });
}

if (!(window as any).PCore.getLocaleUtils) {
  (window as any).PCore.getLocaleUtils = () => {
    return {
      getLocaleValue: (value: any) => value
    } as any;
  };
}

if (!(window as any).PCore.getAssetLoader) {
  (window as any).PCore.getAssetLoader = () => ({
    getSvcImageUrl: (_key: string): Promise<string> =>
      Promise.resolve('https://res.cloudinary.com/dnut6tij7/image/upload/v1780247789/image_trinity_etftbs.png')
  });
}

const STORYBOOK_OVERRIDES: Record<string, string> = {
  HeroImageKey: 'STORYBOOK_HERO_IMAGE'
};

const mockPConnect = () => ({
  getLocalizationService: () => ({
    getLocalizedText: (key: string) =>
      STORYBOOK_OVERRIDES[key] ??
      (localizations.fields as unknown as Record<string, string>)[key] ??
      key
  })
});

export const BaseTmhccDxLibraryClaimForm: Story = (args: any) => {

  const props = {
    ...configProps
  };

  return (
    <>
      <TmhccDxLibraryClaimForm {...props} {...args} />
    </>
  );
};

BaseTmhccDxLibraryClaimForm.args = {
  ...configProps,
  getPConnect: mockPConnect as any
};

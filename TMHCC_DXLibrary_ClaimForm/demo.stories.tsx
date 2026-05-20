/* eslint-disable react/jsx-no-useless-fragment */
import type { Meta, StoryObj } from '@storybook/react';

import TmhccDxLibraryClaimForm from './index';

import { configProps } from './mock';

const meta: Meta<typeof TmhccDxLibraryClaimForm> = {
  title: 'TmhccDxLibraryClaimForm',
  component: TmhccDxLibraryClaimForm,
  excludeStories: /.*Data$/
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

if (!(window as any).PCore.getLocaleUtils) {
  (window as any).PCore.getLocaleUtils = () => {
    return {
      getLocaleValue: (value: any) => value
    } as any;
  };
}

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
  ...configProps
};

import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import '@testing-library/jest-dom';

import * as DemoStories from './demo.stories';



const { BaseTmhccDxLibraryClaimForm } = composeStories(DemoStories);

test('renders TmhccDxLibraryClaimForm', async () => {
  render(<BaseTmhccDxLibraryClaimForm />);
  expect(await screen.findByText('Claim Form')).toBeVisible();
  expect(screen.getByText('Your details')).toBeVisible();
  expect(screen.getByText('Supporting Evidence')).toBeVisible();
  expect(screen.getByRole('button', { name: 'Submit Claim' })).toBeVisible();
});

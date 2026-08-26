import React from 'react';
import { render, screen } from '@testing-library/react';
import { AlmaLogo } from '../src/components/site/alma-logo';

describe('AlmaLogo', () => {
  it('should render colibrí icon and alma wordmark', () => {
    const { container } = render(<AlmaLogo />);
    expect(container.querySelector('img')).toBeTruthy();
    expect(screen.getByText('alma')).toBeTruthy();
  });
});

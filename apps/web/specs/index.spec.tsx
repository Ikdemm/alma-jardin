import React from 'react';
import { render } from '@testing-library/react';
import { AlmaLogo } from '../src/components/site/alma-logo';

describe('AlmaLogo', () => {
  it('should render successfully', () => {
    const { container } = render(<AlmaLogo />);
    expect(container.querySelector('img')).toBeTruthy();
  });
});

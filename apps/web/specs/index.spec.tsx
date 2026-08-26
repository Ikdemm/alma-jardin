import React from 'react';
import { render } from '@testing-library/react';
import { ColibriMark } from '../src/components/site/colibri-mark';

describe('ColibriMark', () => {
  it('should render successfully', () => {
    const { container } = render(<ColibriMark />);
    expect(container.querySelector('svg')).toBeTruthy();
  });
});

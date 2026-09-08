import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ScrollableTabsContainer } from '../ScrollableTabsContainer';

describe('ScrollableTabsContainer Component Suite', () => {
  it('renders children tabs correctly', () => {
    render(
      <ScrollableTabsContainer activeKey="tab1">
        <button type="button" data-active="true">Tab 1</button>
        <button type="button">Tab 2</button>
      </ScrollableTabsContainer>
    );

    expect(screen.getByText('Tab 1')).toBeDefined();
    expect(screen.getByText('Tab 2')).toBeDefined();
  });

  it('renders left and right scroll navigation buttons with appropriate accessible labels', () => {
    render(
      <ScrollableTabsContainer activeKey="tab1">
        <button type="button">Tab Alpha</button>
      </ScrollableTabsContainer>
    );

    const leftButton = screen.getByLabelText('Geser tab ke kiri');
    const rightButton = screen.getByLabelText('Geser tab ke kanan');

    expect(leftButton).toBeDefined();
    expect(rightButton).toBeDefined();
  });
});

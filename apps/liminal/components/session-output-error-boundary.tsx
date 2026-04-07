'use client';

import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class SessionOutputErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: '2rem',
            background: 'rgb(var(--color-surface-2))',
            borderRadius: '6px',
            border: '1px solid rgb(var(--color-border) / 0.1)',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontSize: 'clamp(0.875rem, 0.8rem + 0.25vw, 1rem)',
              color: 'rgb(var(--color-text-muted))',
              fontStyle: 'italic',
            }}
          >
            This session&apos;s output could not be rendered.
          </p>
          <p
            style={{
              marginTop: '0.5rem',
              fontSize: '0.8125rem',
              color: 'rgb(var(--color-text-faint))',
            }}
          >
            The underlying data is preserved and this is a display issue only.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

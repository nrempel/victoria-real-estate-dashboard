'use client';

import { Component, ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ChartErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Chart error:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || (
        <Card className="bg-card rounded-xl card-shadow border-0">
          <CardContent className="h-[320px] flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Unable to load chart</p>
          </CardContent>
        </Card>
      );
    }
    return this.props.children;
  }
}

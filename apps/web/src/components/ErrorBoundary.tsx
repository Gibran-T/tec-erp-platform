import { Component, type ErrorInfo, type ReactNode } from "react";

export interface ErrorBoundaryProps {
  readonly children: ReactNode;
  readonly fallback?: ReactNode;
}

interface ErrorBoundaryState {
  readonly hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("application_error", {
      message: error.message,
      componentStack: errorInfo.componentStack,
    });
  }

  override render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div role="alert" data-testid="error-boundary-fallback">
            <h1>Something went wrong</h1>
            <p>The application encountered an unexpected error. Please refresh the page.</p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

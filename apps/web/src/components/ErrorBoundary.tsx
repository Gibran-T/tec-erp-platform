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
            <h1>Une erreur inattendue est survenue</h1>
            <p>
              Une erreur inattendue est survenue. Veuillez actualiser la page, puis réessayer.
            </p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

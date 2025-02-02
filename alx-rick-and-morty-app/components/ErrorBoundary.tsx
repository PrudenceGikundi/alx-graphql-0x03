import React, { Component, ReactNode } from "react";
import * as Sentry from "@sentry/react";

interface State {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  // componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
  //   console.error("Error caught by ErrorBoundary:", error, errorInfo);
  //   Sentry.captureException(error, { extra: errorInfo });
  // }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
  console.error("Error caught by ErrorBoundary:", error, errorInfo);
  
  Sentry.captureException(error, {
    extra: {
      componentStack: errorInfo.componentStack, // Extract component stack
    },
  });
}

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Oops, there is an error!</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again?
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default Sentry.withErrorBoundary(ErrorBoundary, {
  fallback: (
    <div>
      <h2>Oops, there is an error!</h2>
      <button onClick={() => window.location.reload()}>Try again?</button>
    </div>
  ),
});

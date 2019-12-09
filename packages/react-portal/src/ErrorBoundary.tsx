import React, { ErrorInfo } from 'react';

export interface Logger {
  error: (...args: any[]) => void;
}

interface IProp {
  logger: Logger;
}

interface State {
  hasError: boolean;
  error: Error;
}

class ErrorBoundary extends React.Component<IProp, State> {
  public constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Display fallback UI
    this.setState({ hasError: true, error });
    // You can also log the error to an error reporting service
    if (this.props.logger) {
      this.props.logger.error(error, errorInfo);
    }
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <>
        <h1>Error : {this.state.error.message}.</h1>
        <pre>
          {this.state.error.stack}
        </pre>
      </>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
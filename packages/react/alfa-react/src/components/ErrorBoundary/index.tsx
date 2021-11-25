import React, { ErrorInfo } from 'react';
import isFunction from 'lodash/isFunction';
import ErrorPanel from './ErrorPanel';

export interface Logger {
  error: (...args: any[]) => void;
}

interface IProp {
  logger?: Logger;
  appDidCatch?: (error: Error) => void;
}

interface State {
  hasError: boolean;
  error: Error;
}

class ErrorBoundary extends React.Component<IProp, State> {
  constructor(props: IProp) {
    super(props);
    this.state = {
      hasError: false,
      // @ts-ignore
      error: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Display fallback UI
    this.setState({ hasError: true, error });
    // You can also log the error to an error reporting service
    if (this.props.logger) {
      this.props.logger.error(error, errorInfo);
    } else {
      // @ts-ignore
      isFunction(window?.__bl?.error) && window.__bl.error(error, errorInfo);
    }
    console.error(error);

    this.props.appDidCatch && this.props.appDidCatch(error);
  }

  render() {
    const { error } = this.state;
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (<ErrorPanel error={error} />);
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

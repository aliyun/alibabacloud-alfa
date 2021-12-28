import React, { ErrorInfo } from 'react';
import isFunction from 'lodash/isFunction';
import { AlfaLogger } from '@alicloud/alfa-core';

import ErrorPanel from './ErrorPanel';

interface IProps {
  appDidCatch?: (error?: Error, info?: ErrorInfo) => void;
  logger?: AlfaLogger;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

interface GlobalBl {
  __bl?: {
    error: (...args: any) => void;
  };
}

class ErrorBoundary extends React.Component<IProps, State> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { appDidCatch, logger } = this.props;

    // Display fallback UI
    this.setState({ hasError: true, error });

    isFunction((window as GlobalBl)?.__bl?.error) && (window as GlobalBl)?.__bl?.error(error, errorInfo);

    // You can also log the error to an error reporting service in appDidCatch
    appDidCatch && appDidCatch(error, errorInfo);
    logger?.error({ E_MSG: '', E_STACK: error, C_STACK: errorInfo });
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

import React, { ErrorInfo } from 'react';
import isFunction from 'lodash/isFunction';
import { AlfaLogger } from '@alicloud/alfa-core';

import ErrorPanel from './ErrorPanel';

interface IProps {
  fallbackRender?: (error?: Error) => Element;
  appDidCatch?: (error?: Error, info?: ErrorInfo) => void;
  logger?: AlfaLogger;
}

interface State {
  hasError: boolean;
  error?: Error;
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
      error: undefined,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { appDidCatch, logger } = this.props;

    // Display fallback UI
    this.setState({ hasError: true, error });

    isFunction((window as GlobalBl)?.__bl?.error) && (window as GlobalBl)?.__bl?.error(error, errorInfo);

    // You can also log the error to an error reporting service in appDidCatch
    appDidCatch && appDidCatch(error, errorInfo);
    logger?.error && logger.error({ E_CODE: 'RuntimeError', E_MSG: error.message, E_STACK: error, C_STACK: errorInfo });
  }

  render() {
    const { error } = this.state;
    if (this.state.hasError) {
      if (this.props.fallbackRender) return this.props.fallbackRender(error);
      // You can render any custom fallback UI
      return (<ErrorPanel error={error} />);
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

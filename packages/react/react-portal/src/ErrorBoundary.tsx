import React, { ErrorInfo } from 'react';

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

const padding = 24;
const containerBackground = '#fcebea';

const containerStyle = {
  background: containerBackground,
  padding,
};

const commonErrorStyle = {
  lineHeight: '22px',
  color: '#d93026',
  fontSize: 14,
};

class ErrorBoundary extends React.Component<IProp, State> {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
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
      window.__bl && window.__bl.error && window.__bl.error(error, errorInfo);
    }

    console.error(error);

    this.props.appDidCatch && this.props.appDidCatch(error);
  }

  render() {
    const { error } = this.state;
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div style={{ padding }}>
          {
            process.env.NODE_ENV === 'development'
              ? (
                <div style={containerStyle}>
                  <div style={commonErrorStyle}>{error.message}</div>
                  <pre style={{ overflow: 'scroll' }}>{error.stack}</pre>
                </div>
              )
              : null
          }
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

import React from 'react';

interface IProps {
  error?: Error;
}
const padding = 24;
const containerBackground = '#fcebea';

const containerStyle = {
  display: 'none',
  background: containerBackground,
  padding,
};

const commonErrorStyle = {
  lineHeight: '22px',
  color: '#d93026',
  fontSize: 14,
};

const ErrorPanel: React.FC<IProps> = (props) => {
  const { error } = props;
  return (
    <div style={containerStyle}>
      <div style={commonErrorStyle}>{error?.message}</div>
      <pre style={{ overflow: 'scroll' }}>{error?.stack}</pre>
    </div>
  );
};

export default ErrorPanel;
